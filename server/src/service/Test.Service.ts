import { Request, Response } from "express";
import BudgetModel from "../models/Budget.Model";
import ExpenseModel from "../models/Expense.Model";
import IncomeModel from "../models/Income.Model";
import MonthModel from "../models/Month.Model";
import UserModel from "../models/User.Model";
import UtilsService from "./Utils.Service";

const TestService = {
  hello: async (req: Request, res: Response) => {
    UtilsService.logInfoAndSend200(res, "Hello World!");
  },
  deleteCollections: async (req: Request, res: Response) => {
    try {
      await UserModel.collection.drop();
    } catch (error) {
      console.log("Already dropped");
    }
    try {
      await BudgetModel.collection.drop();
    } catch (error) {
      console.log("Already dropped");
    }
    try {
      await MonthModel.collection.drop();
    } catch (error) {
      console.log("Already dropped");
    }
    try {
      await IncomeModel.collection.drop();
    } catch (error) {
      console.log("Already dropped");
    }
    try {
      await ExpenseModel.collection.drop();
    } catch (error) {
      console.log("Already dropped");
    }
    UtilsService.logInfoAndSend200(res, "Dropped collections");
  }
};

export default TestService;