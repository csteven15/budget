import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, Application } from "express";
import http from "http";
import connect from "./Connect";

import userApi from "./routes/User"

var environment = process.env.NODE_ENV;

const isDevelopment = environment === "development"

let dbPort = isDevelopment ? 27017 : 27018;

let dbHost = isDevelopment ? "localhost" : "mongo";

const db = `mongodb://${dbHost}:${dbPort}`;

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

connect({db});

app.use("/test", async (req : Request, res : Response) => {
  res.status(200).send("Hello World");
})

app.use("/v1", userApi);

const port = 3001;
const server = http.createServer(app);
server.listen(port, () => console.info(`Server running on port ${port}`));