import express from "express";
import BudgetService from "../service/Budget.Service";

const router = express.Router();

// test route
router.get("/budget/test/:userId", BudgetService.testBudget);

// get all budgets
router.get("/budget", BudgetService.getBudgets);

// get budget by id
router.get("/budget/:budgetId", BudgetService.getBudgetByID);

// add new budget
router.post("/budget", BudgetService.addBudget);

// update budget
router.put("/budget/:budgetId", BudgetService.updateBudget);

// delete all budgets
router.delete("/budget", BudgetService.deleteAllBudget);

export default router;