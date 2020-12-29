import express from "express";
import MonthService from "../service/Month.Service";

const router = express.Router();

// test route
router.get("/month/test/:userId", MonthService.testMonth);

// get all months
router.get("/months", MonthService.getMonths);

// get month by id
router.get("/month/:id", MonthService.getMonthByID);

// get month by budgetId
router.get("/month/budgetId/:budgetId", MonthService.getMonthsByBudgetId);

// update month
router.put("/month/:id", MonthService.updateMonth);

// delete all months
router.delete("/months", MonthService.deleteAllMonth);

export default router;