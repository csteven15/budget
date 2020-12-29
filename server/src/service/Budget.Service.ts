import { Request, Response } from "express";
import BudgetModel from "../models/Budget.Model";
import { ExpenseServiceHelper } from "./Expense.Service";
import { IncomeServiceHelper } from "./Income.Service";
import MonthService, { MonthServiceHelper } from "./Month.Service";
import UtilsService from "./Utils.Service";

export const BudgetServiceHelper = {
  getMonthIds: async (budgetId: string) => {
    const validBudget = await UtilsService.validId("Budget", budgetId);
    if (!validBudget) return;
    const budget = await BudgetModel.findById({ _id: budgetId });
    return budget!.months;
  }
};

const BudgetService = {
  testBudget: async (req: Request, res: Response) => {
    console.log("get /budget/test/:userId");

    const userId = req.params.userId;

    const validUser = await UtilsService.validIdRes(res, "User", userId);
    if (!validUser) return;

    try {

      const newBudget = {
        userId: userId,
        year: Math.floor(Math.random() * 100 + 2000),
        months: []
      };

      const budget = await BudgetModel.create(newBudget);

      const months = await MonthServiceHelper.addMonthsForNewBudget(budget.id!);

      budget.months = months;

      budget.save();

      months?.forEach(async (monthId: string) => {
        await IncomeServiceHelper.testAddIncome(budget.id!, monthId);
        await ExpenseServiceHelper.testAddExpense(budget.id!, monthId);
      });

      UtilsService.logInfoAndSend201(res, budget.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a test budget: ${error}`);
    }
  },
  getBudgets: async (req: Request, res: Response) => {
    console.log("get /budgets");

    try {
      const budgets = await BudgetModel.find({});
      UtilsService.logInfoAndSend200(res, budgets);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting budgets: ${error}`);
    }
  },
  getBudgetByID: async (req: Request, res: Response) => {
    console.log("get /budget/:id");

    const id = req.params.id;

    try {
      const budget = await BudgetModel.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, budget?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a budget with ID ${id}: ${error}`);
    }
  },
  addBudget: async (req: Request, res: Response) => {
    console.log("post /budget");

    const userId = req.body.userId;

    const validUser = await UtilsService.validIdRes(res, "User", userId);
    if (!validUser) return;

    try {

      const newBudget = {
        userId: req.body.userId,
        year: req.body.year,
        months: []
      };

      const budget = await BudgetModel.create(newBudget);

      const months = await MonthServiceHelper.addMonthsForNewBudget(budget.id!);

      budget.months = months;

      budget.save();

      UtilsService.logInfoAndSend201(res, `Created budget with id: ${newBudget.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a budget: ${error}`);
    }
  },
  updateBudget: async (req: Request, res: Response) => {
    console.log("put /budget/:id");

    const id = req.params.id;
    const userId = req.body.userId;

    const validBudget = await UtilsService.validIdRes(res, "Budget", id);
    if (!validBudget) return;
    const validUser = await UtilsService.validIdRes(res, "User", userId);
    if (!validUser) return;

    try {
      const updatedBudget = {
        userId: userId,
        year: req.body.year
      };

      await BudgetModel.updateOne({ _id: id }, updatedBudget, { runValidators: true });
      UtilsService.logInfoAndSend200(res, `Updated budget with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a budget: ${error}`);
    }
  },
  deleteAllBudget: async (req: Request, res: Response) => {
    try {
      await BudgetModel.collection.drop();
      UtilsService.logInfoAndSend200(res, `Dropped budget collection`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when deleting budget collection: ${error}`);
    }
  }
};

export default BudgetService;