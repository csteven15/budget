import { Router } from "express";

const routes = Router();

var fs = require("fs");

routes.get("/fetchRuleExpenseRowData", (req, res) => {
  let data = fs.readFileSync("data.json", "utf-8");
  let parsed = JSON.parse(data);
  console.log(parsed);
  return res.json(parsed);
});

routes.post("/postRuleExpenseRowData", (req, res) => {
  console.log(req.body);
  fs.writeFile("data.json", JSON.stringify(req.body, null, 2), () => {
    console.log("done");
  });
});

export default routes;
