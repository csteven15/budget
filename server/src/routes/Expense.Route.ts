import express from "express";
import ExpenseService from "../service/Expense.Service";

const router = express.Router();

// test route
router.get("/expense/test/:userId", ExpenseService.testExpense);

// get all expense
router.get("/expenses", ExpenseService.getExpenses);

// get expense by id
router.get("/expense/:id", ExpenseService.getExpenseByID);

// add new expense
router.post("/expense", ExpenseService.addExpense);

// update expense
router.put("/expense/:id", ExpenseService.updateExpense);

// delete all expenses
router.delete("/expenses", ExpenseService.deleteAllExpense);

export default router;