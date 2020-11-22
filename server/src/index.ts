import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/", (req, res) => {
  res.send("Hello World")
})

const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));