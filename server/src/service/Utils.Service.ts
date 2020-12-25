import { Response } from "express";

const UtilsService = {
  logInfoAndSend200: (res: Response, msg: any) => {
    console.log(msg);
    res.status(200).send(msg);
  },
  logInfoAndSend201: (res: Response, msg: any) => {
    console.log(msg);
    res.status(201).send(msg);
  },
  logErrorAndSend500: (res: Response, msg: string) => {
    console.error(msg);
    res.status(500).send(msg);
  }
};

export default UtilsService;