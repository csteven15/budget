import { Request, Response } from "express";
import Budget from "../models/Budget.Model";
import UtilsService from "./Utils.Service";

const BudgetService = {
  testBudget: async (req: Request, res: Response) => {
    console.log("get /budget/test/:userId");

    const userId = req.params.userId;

    const newBudget = {
      userId: userId,
      year: req.body.year
    };

    try {
      const budget = await Budget.create(newBudget);
      UtilsService.logInfoAndSend201(res, budget.toJSON());

    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a test budget`);
    }
  },
  getBudgets: async (req: Request, res: Response) => {
    console.log("get /budgets");

    try {
      const budgets = await Budget.find({});
      UtilsService.logInfoAndSend200(res, budgets);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting budgets`);
    }
  },
  getBudgetByID: async (req: Request, res: Response) => {
    console.log("get /budget/:id");

    const id = req.params.id;

    try {
      const budget = await Budget.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, budget?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a budget with ID ${id}`);
    }
  },
  addBudget: async (req: Request, res: Response) => {
    console.log("post /budget");

    const newBudget = {
      userId: req.body.userId,
      year: req.body.year
    };

    try {
      const user = await Budget.create(newBudget);
      UtilsService.logInfoAndSend201(res, `Created budget with id: ${newBudget.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a budget`);
    }
  },
  updateBudget: async (req: Request, res: Response) => {
    console.log("put /budget/:id");

    const id = req.params.id;

    try {
      const updatedBudget = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
      await Budget.updateOne({ id: id }, updatedBudget);
      UtilsService.logInfoAndSend200(res, `Updated budget with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a budget`);
    }
  }
};

export default BudgetService;