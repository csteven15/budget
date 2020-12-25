import { Request, Response } from "express";
import Month from "../models/Month.Model";
import UtilsService from "./Utils.Service";


const MonthService = {
  testMonth: async (req: Request, res: Response) => {
    console.log("get /month/:userId");

    const userId = req.params.userId;

    const newMonth = {
      userId: userId,
      budgetId: req.body.budgetId,
      name: req.body.name
    };

    try {
      const month = await Month.create(newMonth);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the month for user with userId ${userId}`);
      return undefined;
    }
  },
  getMonths: async (req: Request, res: Response) => {
    console.log("get /months");

    try {
      const months = await Month.find({});
      UtilsService.logInfoAndSend200(res, months);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting months`);
    }
  },
  getMonthsByID: async (req: Request, res: Response) => {
    console.log("get /month/:id");

    const id = req.params.id;

    try {
      const months = await Month.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, months?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a month with ID ${id}`);
    }
  },
  addMonth: async (req: Request, res: Response) => {
    console.log("post /month");

    const newMonth = {
      userId: req.body.userId,
      budgetId: req.body.budgetId,
      name: req.body.name
    };

    try {
      const user = await Month.create(newMonth);
      UtilsService.logInfoAndSend201(res, `Created month with id: ${newMonth.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a month`);
    }
  },
  updateMonth: async (req: Request, res: Response) => {
    console.log("put /month/:id");

    const id = req.params.id;

    try {
      const updatedBudget = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
      await Month.updateOne({ id: id }, updatedBudget);
      UtilsService.logInfoAndSend200(res, `Updated month with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a month`);
    }
  }
};

export default MonthService;