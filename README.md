# titan-quick-mqtt-tester

quick and dirty tool to publish titan-micro-mqtt related messages

## WARNING

**THIS TOOL IS NO LONGER MAINTAINED AND IS KNOWN TO DEPEND ON VULNERABLE PROJECTS.**

**DO NOT USE THIS IN A PRODUCTION ENVIRONMENT**

## install

simply run `yarn`

## start

simply run `yarn run watch`  
(the program will automatically restart if you change the code)

## use

Visit `localhost:3000/connect` in your prefered browser. Submit the host address of the mqtt broker or use the default.  
You will be forwarded to `localhost:3000/publish` (if you visit this directly you will get a nasty error). There you have some options:

- if you chose `do not use quick publish options` you can configure topic and body yourself (prefix will be added automatically), empty body will be discarded
- you can also chose one of the quick options (e.g. start). In this case the custom topic and body will be ignored and a preconfigured msg will be published

## disclaimer

I do not take responsibility for any problems that result from using this tool. It might just do everything wrong xD
