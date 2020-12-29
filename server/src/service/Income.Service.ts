import { Request, Response } from "express";
import IncomeModel from "../models/Income.Model";
import { randomWordArray } from "../test/random";
import { MonthServiceHelper } from "./Month.Service";
import UtilsService from "./Utils.Service";

export const IncomeServiceHelper = {
  getIncomeArrayFromMonthId: async (monthId: string) => {
    const query = { monthId: monthId };
    return await IncomeModel.find(query);
  },
  addIncomeToMonth: async (frequency: string, budgetId: string, monthId: string, incomeId: string) => {
    if (frequency === "Monthly") {
      await MonthServiceHelper.updateAllMonthIncome(budgetId, incomeId);
    } else {
      await MonthServiceHelper.updateOneMonthIncome(monthId, incomeId);
    }
  },
  testAddIncome: async (budgetId: string, monthId: string) => {
    const newIncome = {
      budgetId: budgetId,
      monthId: monthId,
      name: randomWordArray[Math.floor(Math.random() * 100)],
      amount: Math.floor(Math.random() * 50000) + 10000,
      frequency: Math.random() > 0.5 ? "Monthly" : "Once"
    };

    const income = await IncomeModel.create(newIncome);

    await IncomeServiceHelper.addIncomeToMonth(newIncome.frequency, budgetId, monthId, income.id!);
  }
};

const IncomeService = {
  testIncome: async (req: Request, res: Response) => {
    console.log("get /income/:userId");

    const budgetId = await UtilsService.testFindOneIdByModel("Budget");
    const monthId = await UtilsService.testFindOneIdByModel("Month");

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newIncome = {
        budgetId: budgetId,
        monthId: monthId,
        name: randomWordArray[Math.floor(Math.random() * 100)],
        amount: Math.floor(Math.random() * 50000) + 10000,
        frequency: Math.random() > 0.5 ? "Monthly" : "Once"
      };

      const income = await IncomeModel.create(newIncome);

      await IncomeServiceHelper.addIncomeToMonth(newIncome.frequency, budgetId, monthId, income.id!);

      UtilsService.logInfoAndSend201(res, income.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Error creating the income: ${error}`);
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

    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;
    const frequency = req.body.frequency;

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;
    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const newIncome = {
        budgetId: budgetId,
        monthId: monthId,
        name: req.body.name,
        amount: req.body.amount,
        frequency: req.body.frequency
      };

      const income = await IncomeModel.create(newIncome);

      await IncomeServiceHelper.addIncomeToMonth(frequency, budgetId, monthId, income.id!);

      UtilsService.logInfoAndSend201(res, `Created income: ${income}`);

    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating an income: ${error}`);
    }
  },
  updateIncome: async (req: Request, res: Response) => {
    console.log("put /income/:id");

    const id = req.params.id;
    const budgetId = req.body.budgetId;
    const monthId = req.body.monthId;

    const validBudget = await UtilsService.validIdRes(res, "Budget", budgetId);
    if (!validBudget) return;
    const validIncome = await UtilsService.validIdRes(res, "Income", id);
    if (!validIncome) return;
    const validMonth = await UtilsService.validIdRes(res, "Month", monthId);
    if (!validMonth) return;

    try {
      const updatedIncome = {
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
  },
  deleteAllIncome: async (req: Request, res: Response) => {
    try {
      await IncomeModel.collection.drop();
      UtilsService.logInfoAndSend200(res, `Dropped income collection`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when deleting income collection: ${error}`);
    }
  }
};

export default IncomeService;