#!/usr/bin/env node

const rpi433 = require("rpi-433-v3"),
  myArgs = process.argv.slice(2),
  defArgs = {
    code: 1221,
    debug: false
  },
  fnArgs = [
    {
      stop: 1222,
      start: 1221
    },
    {
      d: true
    }
  ],
  boolArg = {
    d: fnArgs[1].d
  },
  rfEmitter = rpi433.emitter({
    pin: 7, //Send through GPIO 0 (or Physical PIN 11)
    pulseLength: 450, //Send the code with a 350 pulse length
    protocol: 1 //Set the protocol.
  });
let { code, debug } = defArgs;

for (let i = 0; i < myArgs.length; i++) {
  const arg = isNaN(myArgs[i]) ? myArgs[i].replace(/^-/, "",) : Number.parseInt(myArgs[i]);
  debug = arg.length === 1 ? boolArg[arg.replace("-", "")] : debug;
  debug ? console.debug("arg:", i, arg, typeof arg) : null;
  try {
    switch (typeof arg) {
      case "number":
        code = arg;
        break;
      case "string":
      default:
        const argVal = fnArgs.find(v => typeof v[arg] !== "undefined") || arg;
        debug ? console.info("argVal for " + arg + ":") + console.table(argVal) : null;
        if (typeof argVal[arg] !== "undefined") {
          code = argVal[arg];
          break;
        }
        // statements_def
        debug ? console.debug("default:", arg) : null;
        break;
    }
    // statements
  } catch (e) {
    // statements
    console.error(e);
  }

}


//rpi-433 uses the kriskowal's implementation of Promises so,
//if you prefer Promises, you can also use this syntax :
rfEmitter.sendCode(code || 1221).then(
  (stdout) => {
    console.debug("Action output:", stdout);
  },
  (error) => {
    console.error("Code was not send, reason: ", error);
  }
);


// Receive (data is like {code: xxx, pulseLength: xxx})
//rfSniffer.on("data", function(data) {
//  console.log('Code received: ' + data.code + ' Protocol: ' + data.protocol + ' Delay: ' + data.delay)
//});

// Send
/*
rfEmitter.sendCode(code);
rfEmitter.sendCode(code, {  //You can overwrite defaults options previously set (only for this sent)
  pin: 2,
  pulseLength: 350
});
rfEmitter.sendCode(code, callback);
rfEmitter.sendCode(code, {
  pin: 2,
  pulseLength: 350
}, callback);
*/

