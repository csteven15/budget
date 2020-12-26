import { Request, Response } from "express";
import ExpenseModel from "../models/Expense.Model";
import UtilsService from "./Utils.Service";

const ExpenseService = {
  testExpense: async (req: Request, res: Response) => {
    console.log("get /expense/:userId");

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
      const newExpense = {
        userId: userId,
        budgetId: budgetId,
        monthId: monthId,
        name: "Food",
        amount: Math.floor(Math.random() * 500) + 100,
        isFixedAmount: false,
        frequency: "Monthly",
        maxAmount: 10000
      };

      const expense = await ExpenseModel.create(newExpense);
      UtilsService.logInfoAndSend201(res, expense.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the expense for user with userId ${userId}`);
      return undefined;
    }
  },
  getExpenses: async (req: Request, res: Response) => {
    console.log("get /expenses");

    try {
      const expenses = await ExpenseModel.find({});
      UtilsService.logInfoAndSend200(res, expenses);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting expenses`);
    }
  },
  getExpenseByID: async (req: Request, res: Response) => {
    console.log("get /expense/:id");

    const id = req.params.id;

    try {
      const expenses = await ExpenseModel.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, expenses?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting an expense with ID ${id}`);
    }
  },
  addExpense: async (req: Request, res: Response) => {
    console.log("post /expense");

    const userId = req.params.userId;
    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validId(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newExpense = {
        userId: userId,
        budgetId: budgetId,
        monthId: monthId,
        name: req.body.name,
        amount: req.body.amount,
        isFixedAmount: req.body.isFixedAmount,
        frequency: req.body.frequency,
        maxAmount: req.body.maxAmount
      };

      const user = await ExpenseModel.create(newExpense);
      UtilsService.logInfoAndSend201(res, `Created expense with id: ${newExpense.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating an expense`);
    }
  },
  updateExpense: async (req: Request, res: Response) => {
    console.log("put /expense/:id");

    const id = req.params.id;
    const userId = req.body.userId;
    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;

    const validExpense = await UtilsService.validId(res, "Expense", id);
    if (!validExpense) return;
    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;
    const validBudget = await UtilsService.validId(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validId(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const updatedBudget = {
        userId: userId,
        budgetId: budgetId,
        monthId: monthId,
        name: req.body.name,
        amount: req.body.amount,
        isFixedAmount: req.body.isFixedAmount,
        frequency: req.body.frequency,
        maxAmount: req.body.maxAmount
      };
      await ExpenseModel.updateOne({ id: id }, updatedBudget);
      UtilsService.logInfoAndSend200(res, `Updated expense with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating an expense`);
    }
  }
};

export default ExpenseService;