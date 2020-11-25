import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, Application } from "express";
import http from "http";
import connect from "./Connect";

import userApi from "./routes/User"

const db = `mongodb://mongo:27017`;

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

connect({db});

app.use("/test", async (req : Request, res : Response) => {
  res.status(200).send("Hello World");
})

app.use("/v1", userApi);

const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));