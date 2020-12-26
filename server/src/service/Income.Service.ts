import { Request, Response } from "express";
import IncomeModel from "../models/Income.Model";
import UtilsService from "./Utils.Service";

const IncomeService = {
  testIncome: async (req: Request, res: Response) => {
    console.log("get /income/:userId");

    const userId = req.params.userId;
    const budgetId = await UtilsService.testFindOneIdByModel("Budget");
    const monthId = await UtilsService.testFindOneIdByModel("Month");

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validId(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newIncome = {
        userId: userId,
        budgetId: budgetId,
        monthId: monthId,
        name: "Stonks",
        amount: Math.floor(Math.random() * 50000) + 10000,
        frequency: "Once"
      };

      const income = await IncomeModel.create(newIncome);
      UtilsService.logInfoAndSend201(res, income.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the income for user with userId ${userId}: ${error}`);
      return undefined;
    }
  },
  getIncomes: async (req: Request, res: Response) => {
    console.log("get /incomes");

    try {
      const incomes = await IncomeModel.find({});
      UtilsService.logInfoAndSend200(res, incomes);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting incomes: ${error}`);
    }
  },
  getIncomeByID: async (req: Request, res: Response) => {
    console.log("get /income/:id");

    const id = req.params.id;

    try {
      const incomes = await IncomeModel.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, incomes?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting an income with ID ${id}: ${error}`);
    }
  },
  addIncome: async (req: Request, res: Response) => {
    console.log("post /income");

    const userId = req.body.userId;
    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validId(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newIncome = {
        userId: userId,
        budgetId: budgetId,
        monthId: monthId,
        name: req.body.name,
        amount: req.body.amount,
        frequency: req.body.frequency
      };

      // TODO: prevent duplicate names

      const user = await IncomeModel.create(newIncome);
      UtilsService.logInfoAndSend201(res, `Created income with id: ${newIncome.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating an income: ${error}`);
    }
  },
  updateIncome: async (req: Request, res: Response) => {
    console.log("put /income/:id");

    const id = req.params.id;
    const userId = req.body.userId;
    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;

    const validIncome = await UtilsService.validId(res, "Income", id);
    if (!validIncome) return;
    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validId(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const updatedIncome = {
        userId: userId,
        budgetId: budgetId,
        monthId: monthId,
        name: req.body.name,
        amount: req.body.amount,
        frequency: req.body.frequency
      };

      await IncomeModel.updateOne({ id: id }, updatedIncome);
      UtilsService.logInfoAndSend200(res, `Updated income with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating an income: ${error}`);
    }
  }
};

export default IncomeService;