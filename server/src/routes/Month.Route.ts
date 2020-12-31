import express from "express";
import MonthService from "../service/Month.Service";

const router = express.Router();

// test route
router.get("/month/test/:userId", MonthService.testMonth);

// get all months
router.get("/month", MonthService.getMonths);

// get month by id
router.get("/month/:monthId", MonthService.getMonthByID);

// get month by budgetId
router.get("/month/budgetId/:budgetId", MonthService.getMonthsByBudgetId);

// update month
router.put("/month/:monthId", MonthService.updateMonth);

// delete all months
router.delete("/month", MonthService.deleteAllMonth);

export default router;