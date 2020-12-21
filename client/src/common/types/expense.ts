import { FrequencyEnum } from "../enums/frequency"

export interface Expense {
  name: string;
  amount: number;
  isFixedAmount: boolean;
  frequency: FrequencyEnum;
  maxAmount: number;
};