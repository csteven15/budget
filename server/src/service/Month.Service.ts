import { Request, Response } from "express";
import { EMonth } from "../enums/EMonth";
import MonthModel, { IMonth } from "../models/Month.Model";
import { BudgetServiceHelper } from "./Budget.Service";
import { ExpenseServiceHelper } from "./Expense.Service";
import { IncomeServiceHelper } from "./Income.Service";
import UtilsService from "./Utils.Service";

export const MonthServiceHelper = {
  addMonth: async (budgetId: string, name: string) => {
    try {
      const newMonth = {
        budgetId: budgetId,
        name: name,
        incomes: [],
        expenses: []
      };

      return await MonthModel.create(newMonth);
    } catch (error) {
      return undefined;
    }
  },
  addMonthsForNewBudget: async (budgetId: string) => {
    let months: string[] = [];
    const monthStringArray = Object.keys(EMonth).slice(12);
    for (const month of monthStringArray) {
      console.log(month);
      const newMonth = await MonthServiceHelper.addMonth(budgetId, month);
      if (newMonth === undefined) break;
      months.push(newMonth.id!);
    }
    console.log(months);
    if (months.length !== 12) return undefined;
    return months;
  },
  updateAllMonthIncome: async (budgetId: string, incomeId: string) => {
    await MonthModel.updateMany({ budgetId: budgetId }, {
      $push: {
        incomes: incomeId
      }
    });
  },
  updateOneMonthIncome: async (monthId: string, incomeId: string) => {
    await MonthModel.updateOne({ _id: monthId }, {
      $push: {
        incomes: incomeId
      }
    });
  },
  updateAllMonthExpense: async (budgetId: string, expenseId: string) => {
    await MonthModel.updateMany({ budgetId: budgetId }, {
      $push: {
        expenses: expenseId
      }
    });
  },
  updateOneMonthExpense: async (monthId: string, expenseId: string) => {
    await MonthModel.updateOne({ _id: monthId }, {
      $push: {
        expenses: expenseId
      }
    });
  }
};

const MonthService = {
  testMonth: async (req: Request, res: Response) => {
    console.log("get /month/test");

    const budgetId = await UtilsService.testFindOneIdByModel("Budget");

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;

    try {
      const newMonth = {
        budgetId: budgetId,
        name: "January",
        incomes: [],
        expenses: []
      };

      const month = await MonthModel.create(newMonth);
      UtilsService.logInfoAndSend201(res, month.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the month: ${error}`);
      return undefined;
    }
  },
  getMonthByID: async (req: Request, res: Response) => {
    console.log("get /month/:monthId");

    const monthId = req.params.monthId;

    try {
      const month = await MonthModel.findById({ _id: monthId });
      UtilsService.logInfoAndSend200(res, month!.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a month with ID ${monthId}: ${error}`);
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
  getMonthsByBudgetId: async (req: Request, res: Response) => {
    console.log("get /months/budget/:budgetId");

    const budgetId = req.params.budgetId;

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;

    // array of month ids
    const monthsIdArray = await BudgetServiceHelper.getMonthIds(budgetId);
    // call income service get incomes
    // call expense service get expenses
    // for each month id
    const fullDetailMonthArray = monthsIdArray?.map(async (monthId) => {
      // grab the month
      const month = await MonthModel.findById({ _id: monthId });

      const income = await IncomeServiceHelper.getIncomeArrayFromMonthId(monthId);
      const expense = await ExpenseServiceHelper.getExpenseArrayFromMonthId(monthId);

      const detailedMonth = {
        budgetId: month!.budgetId,
        name: month!.name,
        incomes: income,
        expenses: expense
      };

      return detailedMonth;
    });

    console.log(fullDetailMonthArray);


  },
  updateMonth: async (req: Request, res: Response) => {
    console.log("put /month/:monthId");

    const monthId = req.params.monthId;
    const budgetId = req.body.budgetId;

    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;
    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;

    try {
      const updatedMonth = {
        budgetId: budgetId,
        name: req.body.name
      };

      await MonthModel.updateOne({ _id: monthId }, updatedMonth);
      UtilsService.logInfoAndSend200(res, `Updated month with id: ${monthId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a month: ${error}`);
    }
  },
  deleteAllMonth: async (req: Request, res: Response) => {
    try {
      await MonthModel.collection.drop();
      UtilsService.logInfoAndSend200(res, `Dropped month collection`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when deleting income collection: ${error}`);
    }
  }
};

export default MonthService;