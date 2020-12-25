import { Request, Response } from "express";
import Income from "../models/Income.Model";
import UtilsService from "./Utils.Service";

const IncomeService = {
  testIncome: async (req: Request, res: Response) => {
    console.log("get /income/:userId");

    const userId = req.params.userId;

    const newIncome = {
      userId: userId,
      budgetId: req.body.budgetId,
      monthId: req.body.monthId,
      name: req.body.name,
      amount: req.body.amount,
      frequency: req.body.frequency
    };

    try {
      const income = await Income.create(newIncome);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the income for user with userId ${userId}`);
      return undefined;
    }
  },
  getIncomes: async (req: Request, res: Response) => {
    console.log("get /incomes");

    try {
      const incomes = await Income.find({});
      UtilsService.logInfoAndSend200(res, incomes);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting incomes`);
    }
  },
  getIncomeByID: async (req: Request, res: Response) => {
    console.log("get /income/:id");

    const id = req.params.id;

    try {
      const incomes = await Income.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, incomes?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting an income with ID ${id}`);
    }
  },
  addIncome: async (req: Request, res: Response) => {
    console.log("post /income");

    const newIncome = {
      userId: req.body.userId,
      budgetId: req.body.budgetId,
      monthId: req.body.monthId,
      name: req.body.name,
      amount: req.body.amount,
      frequency: req.body.frequency
    };

    try {
      const user = await Income.create(newIncome);
      UtilsService.logInfoAndSend201(res, `Created income with id: ${newIncome.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating an income`);
    }
  },
  updateIncome: async (req: Request, res: Response) => {
    console.log("put /income/:id");

    const id = req.params.id;

    try {
      const updatedBudget = {
        userId: req.body.userId,
        budgetId: req.body.budgetId,
        monthId: req.body.monthId,
        name: req.body.name,
        amount: req.body.amount,
        frequency: req.body.frequency
      };
      await Income.updateOne({ id: id }, updatedBudget);
      UtilsService.logInfoAndSend200(res, `Updated income with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating an income`);
    }
  }
};

export default IncomeService;