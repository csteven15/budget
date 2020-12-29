import express from "express";
import BudgetService from "../service/Budget.Service";

const router = express.Router();

// test route
router.get("/budget/test/:userId", BudgetService.testBudget);

// get all budgets
router.get("/budgets", BudgetService.getBudgets);

// get budget by id
router.get("/budget/:id", BudgetService.getBudgetByID);

// add new budget
router.post("/budget", BudgetService.addBudget);

// update budget
router.put("/budget/:id", BudgetService.updateBudget);

// delete all budgets
router.delete("/budgets", BudgetService.deleteAllBudget);

export default router;