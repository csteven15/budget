import { Request, Response } from "express";
import BudgetModel from "../models/Budget.Model";
import UtilsService from "./Utils.Service";

const BudgetService = {
  testBudget: async (req: Request, res: Response) => {
    console.log("get /budget/test/:userId");

    const userId = req.params.userId;

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;

    try {
      const newBudget = {
        userId: userId,
        year: Math.floor(Math.random() * 100 + 2000)
      };

      const budget = await BudgetModel.create(newBudget);
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

    const validUser = await UtilsService.validId(res, "User", userId);
    if (!validUser) return;

    const newBudget = {
      userId: req.body.userId,
      year: req.body.year
    };

    try {
      await BudgetModel.create(newBudget);
      UtilsService.logInfoAndSend201(res, `Created budget with id: ${newBudget.userId}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a budget: ${error}`);
    }
  },
  // Todo: add budget with all 12 months
  updateBudget: async (req: Request, res: Response) => {
    console.log("put /budget/:id");

    const id = req.params.id;
    const userId = req.body.userId;

    const validBudget = await UtilsService.validId(res, "Budget", id);
    if (!validBudget) return;
    const validUser = await UtilsService.validId(res, "User", userId);
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
  }
};

export default BudgetService;