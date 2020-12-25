import express from "express";
import MonthService from "../service/Month.Service";

const router = express.Router();

// test route
router.get("/month/test/:userId", MonthService.testMonth);

// get all months
router.get("/months", MonthService.getMonths);

// get month by id
router.get("/months/:id", MonthService.getMonthsByID);

// add new month
router.post("/month", MonthService.addMonth);

// update month
router.put("/month:id", MonthService.updateMonth);

export default router;