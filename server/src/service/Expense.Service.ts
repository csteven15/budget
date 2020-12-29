import { Request, Response } from "express";
import ExpenseModel from "../models/Expense.Model";
import { randomWordArray } from "../test/random";
import { MonthServiceHelper } from "./Month.Service";
import UtilsService from "./Utils.Service";

export const ExpenseServiceHelper = {
  getExpenseArrayFromMonthId: async (monthId: string) => {
    const query = { monthId: monthId };
    return await ExpenseModel.find(query);
  },
  addExpenseToMonth: async (frequency: string, budgetId: string, monthId: string, expenseId: string) => {
    if (frequency === "Monthly") {
      await MonthServiceHelper.updateAllMonthExpense(budgetId, expenseId);
    } else {
      await MonthServiceHelper.updateOneMonthExpense(monthId, expenseId);
    }
  },
  testAddExpense: async (budgetId: string, monthId: string) => {
    const newExpense = {
      budgetId: budgetId,
      monthId: monthId,
      name: randomWordArray[Math.floor(Math.random() * 100)],
      amount: Math.floor(Math.random() * 500) + 100,
      isFixedAmount: Math.random() > 0.5 ? true : false,
      frequency: Math.random() > 0.5 ? "Monthly" : "Once",
      maxAmount: Math.floor(Math.random() * 500) + 500
    };

    const expense = await ExpenseModel.create(newExpense);

    await ExpenseServiceHelper.addExpenseToMonth(newExpense.frequency, budgetId, monthId, expense.id!);
  }
};

const ExpenseService = {
  testExpense: async (req: Request, res: Response) => {
    console.log("get /expense/test");

    const budgetId = await UtilsService.testFindOneIdByModel("Budget");
    const monthId = await UtilsService.testFindOneIdByModel("Month");

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newExpense = {
        budgetId: budgetId,
        monthId: monthId,
        name: randomWordArray[Math.floor(Math.random() * 100)],
        amount: Math.floor(Math.random() * 500) + 100,
        isFixedAmount: Math.random() > 0.5 ? true : false,
        frequency: Math.random() > 0.5 ? "Monthly" : "Once",
        maxAmount: Math.floor(Math.random() * 500) + 500
      };

      const expense = await ExpenseModel.create(newExpense);

      await ExpenseServiceHelper.addExpenseToMonth(newExpense.frequency, budgetId, monthId, expense.id!);

      UtilsService.logInfoAndSend201(res, expense.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the expense: ${error}`);
      return undefined;
    }
  },
  getExpenses: async (req: Request, res: Response) => {
    console.log("get /expenses");

    try {
      const expenses = await ExpenseModel.find({});
      UtilsService.logInfoAndSend200(res, expenses);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting expenses: ${error}`);
    }
  },
  getExpenseByID: async (req: Request, res: Response) => {
    console.log("get /expense/:id");

    const id = req.params.id;

    try {
      const expenses = await ExpenseModel.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, expenses?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting an expense with ID ${id}: ${error}`);
    }
  },
  addExpense: async (req: Request, res: Response) => {
    console.log("post /expense");

    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;
    const frequency = req.body.frequency;

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newExpense = {
        budgetId: budgetId,
        monthId: monthId,
        name: req.body.name,
        amount: req.body.amount,
        isFixedAmount: req.body.isFixedAmount,
        frequency: req.body.frequency,
        maxAmount: req.body.maxAmount
      };

      const expense = await ExpenseModel.create(newExpense);

      await ExpenseServiceHelper.addExpenseToMonth(frequency, budgetId, monthId, expense.id!);

      UtilsService.logInfoAndSend201(res, `Created expense: ${expense}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating an expense: ${error}`);
    }
  },
  updateExpense: async (req: Request, res: Response) => {
    console.log("put /expense/:id");

    const id = req.params.id;
    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;

    const validExpense = await UtilsService.validIdRes(res, "Expense", id);
    if (!validExpense) return;
    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const updatedBudget = {
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
  },
  deleteAllExpense: async (req: Request, res: Response) => {
    try {
      await ExpenseModel.collection.drop();
      UtilsService.logInfoAndSend200(res, `Dropped expense collection`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when deleting expense collection: ${error}`);
    }
  }
};

export default ExpenseService;