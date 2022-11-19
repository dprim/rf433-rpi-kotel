import express from 'express';
import rpi433 from "rpi-433-v3";
import { exec } from "child_process";

const fnArgs = {
  zatop: 1221,
  netop: 1222
};

let defRet = {
  "state": "Error",
  "resCode": 500
};

const actionResult = (error, stdout, stderr) => {
  error = error || stderr;
  let ret = defRet;
  if (error) {
    console.error("Code was not send, reason: ", error);
    ret = { "state": error.trim(), resCode: 500 };
  } else {
    console.info("Action output:", stdout);
    ret = { "state": stdout.trim(), resCode: 200 };
  };
  return ret;
};

const deviceAction = (device_id, action) => {
  let ret = defRet;
  switch (device_id) {
    case "kotel":
      ret = exec(action, actionResult);
      break;

    default:
      console.error("Code was not send, reason: ", "Missing \"device_id\" parameter");
      ret = { "state": error.trim(), resCode: 500 };
      break;
  }
  return ret;
};

const run = (port = 8433) => {
  const app = express();
  app.use(express.json());
  app.post('/api/rf', (req, res, next) => {
    const { device_id, action } = req.body;
    const ret = deviceAction(device_id, action);
    res.status(ret.resCode).json(ret);
    //await send(fnArgs[req.params.action]);
    //const ret = await send(fnArgs[req.params.action]);
    // return true;
  });

  app.listen(port, () => console.info("Listen on:","Port: " + port, "Host: " + process.env.HOST));
};

const kotel = { run }

export default kotel;


/*
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
*/