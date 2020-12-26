import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, Application } from "express";
import http from "http";

import connect from "./Connect";
import userRoute from "./routes/User.Route";
import budgetRoute from "./routes/Budget.Route";
import monthRoute from "./routes/Month.Route";
import incomeRoute from "./routes/Income.Route";
import expenseRoute from "./routes/Expense.Route";

var environment = process.env.NODE_ENV;

const isDevelopment = environment === "development";
const isDockerDevelopment = environment === "docker_development";

let dbPort = isDevelopment ? 27017 : 27018;

let dbHost = isDockerDevelopment || isDevelopment ? "localhost" : "mongo";

const db = `mongodb://${dbHost}:${dbPort}/test`;

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

connect(db);

app.use("/test", async (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

app.use("/v1", userRoute);
app.use("/v1", budgetRoute);
app.use("/v1", monthRoute);
app.use("/v1", incomeRoute);
app.use("/v1", expenseRoute);

const port = 3001;
const server = http.createServer(app);
server.listen(port, () => console.info(`Server running on port ${port}`));