import { connect as mqttConnect, MqttClient } from "mqtt";
const router = require("express").Router();

let publish: (topic: string, message: string) => void = () => {
  throw new Error("need to connect to a host first");
}; // very dirty to have this as a global variable...

// quick options: [description, topic, message]
const mqttQuickOptions: [string, string, unknown][] = [
  ["do not use quick options", undefined, undefined],
  ["start", "cmd/print/start", undefined],
  ["stop", "cmd/print/stop", undefined],
  ["one print only", "cmd/print/job/set", [["onePrint.job", 1]]],
  ["endless job", "cmd/print/job/set", [["endless.job", -1]]],
  [
    "queue of 3",
    "cmd/print/job/set",
    [
      ["first.job", 1],
      ["second.job", 1],
      ["third.job", 1]
    ]
  ]
];
const title = "TITAN-micro-MQTT";
const mqttDefaults = { host: "mqtt://localhost", prefix: "reajet/testing" };
const mqttOptionDefaults = {
  client: "gui",
  uuid: 42,
  topic: "",
  body: "",
  quickOptions: mqttQuickOptions
};

router.get("/connect", (req, res) => {
  res.render("con", {
    title: title,
    data: mqttDefaults
  });
});
router.post("/connect", async (req, res) => {
  publish = await getMqttPublisher(req.body.host, req.body.prefix);
  res.redirect("/publish");
  res.render(
    "con",
    {
      title: title,
      data: req.body,
      response: "we received some data from you"
    },
    function(err, html) {
      res.send(html);
    }
  );
});

router.get("/publish", (req, res) => {
  res.render("form", {
    title: title,
    data: mqttOptionDefaults
  });
});
router.post("/publish", (req, res) => {
  let topic, body;
  if (quickOptionWasUsed(req.body.quickPub)) {
    console.log("using quick option");
    [, topic, body] = mqttQuickOptions.find(a => a[0] === req.body.quickPub);
  } else {
    topic = req.body.topic;
    body = req.body.body;
  }
  publish(
    topic,
    prepareMessage(req.body.client, req.body.uuid, parseBody(body))
  );
  res.render("form", {
    title: title,
    data: {
      ...req.body,
      ...{
        quickOptions: mqttQuickOptions
          .map(a => a)
          .sort((a, b) =>
            a[0] === req.body.quickPub ? -1 : b[0] === req.body.quickPub ? 1 : 0
          )
      }
    }
  });
});

function parseBody(body: string): string | unknown {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function quickOptionWasUsed(usedOption): boolean {
  console.log("used: " + usedOption);
  console.log("notUsing..." + mqttQuickOptions[0][0]);
  return usedOption !== mqttQuickOptions[0][0];
}

function getMqttPublisher(
  host,
  prefix
): Promise<(topic: string, message: string) => void> {
  return new Promise((resolve, reject) => {
    const client = mqttConnect(host);
    function publish(topic: string, message: string) {
      console.log(`publishing to ${prefix}/${topic}: ${message}`);
      client.publish(prefix + "/" + topic, message);
    }
    client.once("connect", () => {
      resolve(publish);
    });
    client.once("error", () => {
      reject("connection to mqtt broker failed");
    });
  });
}

function prepareMessage(client: string, uuid: number, body: unknown): string {
  const payload = {
    header: {
      client: client,
      uuid: uuid
    },
    body: body
  };
  if (payload.body === "") payload.body = undefined;
  return JSON.stringify(payload);
}

module.exports = router;
