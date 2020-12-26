import { Request, Response } from "express";
import MonthModel from "../models/Month.Model";
import UtilsService from "./Utils.Service";

const MonthService = {
  testMonth: async (req: Request, res: Response) => {
    console.log("get /month/:userId");

    const userId = req.params.userId;
    const budgetId: string = await UtilsService.testFindOneIdByModel("Budget");

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;

    try {
      const newMonth = {
        userId: userId,
        budgetId: budgetId,
        name: "January"
      };

      const month = await MonthModel.create(newMonth);
      UtilsService.logInfoAndSend201(res, month.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the month for user with userId ${userId}: ${error}`);
      return undefined;
    }
  },
  getMonths: async (req: Request, res: Response) => {
    console.log("get /months");

    try {
      const months = await MonthModel.find({});
      UtilsService.logInfoAndSend200(res, months);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting months: ${error}`);
    }
  },
  getMonthsByID: async (req: Request, res: Response) => {
    console.log("get /month/:id");

    const id = req.params.id;

    try {
      const months = await MonthModel.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, months?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a month with ID ${id}: ${error}`);
    }
  },
  addMonth: async (req: Request, res: Response) => {
    console.log("post /month");

    const userId = req.body.userId;
    const budgetId = req.body.budgetId;

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;

    try {
      const newMonth = {
        userId: userId,
        budgetId: budgetId,
        name: req.body.name
      };

      // TODO: prevent duplicate names

      const user = await MonthModel.create(newMonth);
      UtilsService.logInfoAndSend201(res, `Created month with id: ${newMonth.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a month: ${error}`);
    }
  },
  updateMonth: async (req: Request, res: Response) => {
    console.log("put /month/:id");

    const id = req.params.id;
    const userId = req.body.userId;
    const budgetId = req.body.budgetId;

    const validMonth = await UtilsService.validId(res, "Month", id);
    if (!validMonth) return;
    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;

    try {
      const updatedMonth = {
        userId: userId,
        budgetId: budgetId,
        name: req.body.name
      };

      await MonthModel.updateOne({ _id: id }, updatedMonth);
      UtilsService.logInfoAndSend200(res, `Updated month with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a month: ${error}`);
    }
  }
};

export default MonthService;