import { connect as mqttConnect, MqttClient } from "mqtt";
import bodyParser = require("body-parser");
import { isMainThread } from "worker_threads";

export interface QuickOption {
  desc: string;
  topic: string;
  body: unknown;
}

export class QuickMqttPublisher {
  public mqttClient: MqttClient;
  public host: string = "mqtt://localhost";
  public prefix: string = "reajet/testing";
  public client: string = "Quick Titan-Micro-MQTT";
  public uuid: number = 42;
  public topic: string = "";
  public body: string;
  public quickOptions: QuickOption[] = [
    { desc: "do not use quick options", topic: undefined, body: undefined },
    { desc: "start", topic: "cmd/print/start", body: undefined },
    { desc: "stop", topic: "cmd/print/stop", body: undefined },
    {
      desc: "set: one print only",
      topic: "cmd/print/job/set",
      body: [["onePrint.job", 1]]
    },
    {
      desc: "set: endless job",
      topic: "cmd/print/job/set",
      body: [["endless.job", -1]]
    },
    {
      desc: "set: queue of 3",
      topic: "cmd/print/job/set",
      body: [
        ["first.job", 1],
        ["second.job", 1],
        ["third.job", 1]
      ]
    },
    {
      desc: "add: one print only",
      topic: "cmd/print/job/add",
      body: [["onePrint.job", 1]]
    }
  ];

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mqttClient = mqttConnect(this.host);
      this.mqttClient.once("connect", () => {
        resolve();
      });
      this.mqttClient.once("error", () => {
        reject("connection to mqtt broker failed");
      });
    });
  }

  public publish() {
    this.mqttClient.publish(
      this.prefix + "/" + this.topic,
      this.prepareMessage(this.body, this.uuid)
    );
  }

  public update(data: any) {
    if (data.host) this.host = data.host;
    if (data.prefix) this.prefix = data.prefix;
    if (data.client) this.client = data.client;
    if (data.uuid) this.uuid = data.uuid;
    if (data.topic) this.topic = data.topic;
    if (data.body) this.body = data.body;
    if (data.quickPub) {
      if (data.quickPub !== this.quickOptions[0].desc) {
        const option = this.quickOptions.find(
          opt => opt.desc === data.quickPub
        );
        this.topic = option.topic;
        this.body = JSON.stringify(option.body);
      }
    }
  }

  public getConnectData(): { host: string } {
    return {
      host: this.host
    };
  }

  public getPublishData(): {
    client: string;
    uuid: number;
    prefix: string;
    topic: string;
    body: string;
    quickOptions: QuickOption[];
  } {
    return {
      client: this.client,
      uuid: this.uuid,
      prefix: this.prefix,
      topic: this.topic,
      body: this.body,
      quickOptions: this.quickOptions
    };
  }

  private prepareMessage(body: string, uuid: number): string {
    return JSON.stringify({
      header: {
        client: this.client,
        uuid: uuid
      },
      body: this.parseBody(body)
    });
  }

  private parseBody(body: string): string | unknown | undefined {
    if (body === "") return undefined;
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
}
