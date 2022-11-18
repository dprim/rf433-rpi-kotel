import express from 'express';
import rpi433 from "rpi-433-v3";
import { exec } from "child_process";

const fnArgs = {
  zatop: 1221,
  netop: 1222
};

const send = async (code = fnArgs.zatop) => {
  const ret = rpi433.emitter({
    pin: 7, //Send through GPIO 0 (or Physical PIN 11)
    pulseLength: 500, //Send the code with a 350 pulse length
    protocol: 1 //Set the protocol.
  })
    .sendCode(code)
    .then(
      (stdout) => {
        console.info("Action output:", stdout);
        return { "message": stdout.trim(), resCode: 200 };
      },
      (error) => {
        console.error("Code was not send, reason: ", error);
        return { "message": error.trim(), resCode: 500 };
      });
  return await ret;
};

const run = (port = 8433) => {
  const app = express();
  app.get('/api/rf/kotel/:action', (req, res) => {
    exec(
      req.params.action,
      function (error, stdout, stderr) {
        error = error || stderr;
        let ret;
        if (error) {
          console.error("Code was not send, reason: ", error);
          ret = { "message": error.trim(), resCode: 500 };
        } else {
          console.info("Action output:", stdout);
          ret = { "message": stdout.trim(), resCode: 200 };
        };
        res.status(ret.resCode).json(ret);
      });
    //await send(fnArgs[req.params.action]);
    //const ret = await send(fnArgs[req.params.action]);
    // return true;
  });

  app.listen(port)
  console.info("Listen on port: " + port);
};

const kotel = { run }

export default kotel;