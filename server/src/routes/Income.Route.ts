import express from "express";
import IncomeService from "../service/Income.Service";

const router = express.Router();

// test route
router.get("/income/test/:userId", IncomeService.testIncome);

// get all incomes
router.get("/incomes", IncomeService.getIncomes);

// get income by id
router.get("/income/:id", IncomeService.getIncomeByID);

// add new income
router.post("/income", IncomeService.addIncome);

// update income
router.put("/income/:id", IncomeService.updateIncome);

// delete all income
router.delete("/incomes", IncomeService.deleteAllIncome);

export default router;