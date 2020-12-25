import { Request, Response } from "express";
import Expense from "../models/Expense.Model";
import UtilsService from "./Utils.Service";

const ExpenseService = {
  testExpense: async (req: Request, res: Response) => {
    console.log("get /expense/:userId");

    const userId = req.params.userId;

    const newExpense = {
      userId: userId,
      budgetId: req.body.budgetId,
      monthId: req.body.monthId,
      name: req.body.name,
      amount: req.body.amount,
      isFixedAmount: req.body.isFixedAmount,
      frequency: req.body.frequency,
      maxAmount: req.body.maxAmount
    };

    try {
      const expense = await Expense.create(newExpense);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the expense for user with userId ${userId}`);
      return undefined;
    }
  },
  getExpenses: async (req: Request, res: Response) => {
    console.log("get /expenses");

    try {
      const expenses = await Expense.find({});
      UtilsService.logInfoAndSend200(res, expenses);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting expenses`);
    }
  },
  getExpenseByID: async (req: Request, res: Response) => {
    console.log("get /expense/:id");

    const id = req.params.id;

    try {
      const expenses = await Expense.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, expenses?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting an expense with ID ${id}`);
    }
  },
  addExpense: async (req: Request, res: Response) => {
    console.log("post /expense");

    const newExpense = {
      userId: req.body.userId,
      budgetId: req.body.budgetId,
      monthId: req.body.monthId,
      name: req.body.name,
      amount: req.body.amount,
      isFixedAmount: req.body.isFixedAmount,
      frequency: req.body.frequency,
      maxAmount: req.body.maxAmount
    };

    try {
      const user = await Expense.create(newExpense);
      UtilsService.logInfoAndSend201(res, `Created expense with id: ${newExpense.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating an expense`);
    }
  },
  updateExpense: async (req: Request, res: Response) => {
    console.log("put /expense/:id");

    const id = req.params.id;

    try {
      const updatedBudget = {
        userId: req.body.userId,
        budgetId: req.body.budgetId,
        monthId: req.body.monthId,
        name: req.body.name,
        amount: req.body.amount,
        isFixedAmount: req.body.isFixedAmount,
        frequency: req.body.frequency,
        maxAmount: req.body.maxAmount
      };
      await Expense.updateOne({ id: id }, updatedBudget);
      UtilsService.logInfoAndSend200(res, `Updated expense with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating an expense`);
    }
  }
};

export default ExpenseService;