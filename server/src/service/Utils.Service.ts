import { Response } from "express";
import { Collection } from "mongoose";
import BudgetModel from "../models/Budget.Model";
import ExpenseModel from "../models/Expense.Model";
import IncomeModel from "../models/Income.Model";
import MonthModel from "../models/Month.Model";
import UserModel from "../models/User.Model";

// helper functions
const UtilsServiceHelper = {
  modelIdExists: async (model: any & Collection, id: string) => {
    const ref = await model.findOne({ _id: id });
    if (ref === null) {
      return false;
    }
    return true;
  },
  findOneId: async (model: any & Collection) => {
    return await model.findOne({});
  }
};

const useModel = (modelType: string) => {
  let model;
  switch (modelType) {
    case "User":
      model = UserModel;
      UserModel;
      break;
    case "Budget":
      model = BudgetModel;
      break;
    case "Month":
      model = MonthModel;
      break;
    case "Income":
      model = IncomeModel;
      break;
    case "Expense":
      model = ExpenseModel;
      break;
    default:
      model = undefined;
      break;
  }
  return model;
};

const UtilsService = {
  logInfoAndSend200: (res: Response, msg: any) => {
    console.log(msg);
    res.status(200).send(msg);
  },
  logInfoAndSend201: (res: Response, msg: any) => {
    console.log(msg);
    res.status(201).send(msg);
  },
  logErrorAndSend500: (res: Response, msg: string) => {
    console.error(msg);
    res.status(500).send(msg);
  },
  validId: async (modelType: string, id: string) => {
    let model = useModel(modelType);
    if (model === undefined) return false;
    const exists = await UtilsServiceHelper.modelIdExists(model, id);
    if (!exists) return false;
    return true;
  },
  validIdRes: async (res: Response, modelType: string, id: string) => {
    let model = useModel(modelType);
    if (model === undefined) return false;
    const exists = await UtilsServiceHelper.modelIdExists(model, id);
    if (!exists) {
      const msg = `Invalid ${modelType.toLowerCase()}Id`;
      console.error(msg);
      res.status(500).send(msg);
      return false;
    }
    return true;
  },
  testFindOneIdByModel: async (modelType: string) => {
    let model = useModel(modelType);
    if (model === undefined) return -1;
    const doc = await UtilsServiceHelper.findOneId(model);
    if (doc === null) return -1;
    return doc.id;
  },
  enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
  }
};

export default UtilsService;