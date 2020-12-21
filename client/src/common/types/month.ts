import { Income } from "./income";
import { Expense } from "./expense";
import { MonthEnum } from "../enums/month";

export interface Month {
  name: MonthEnum;
  income: Array<Income>;
  expense: Array<Expense>;
};