import { FrequencyEnum } from "../enums/frequency"

export interface Income {
  name: string;
  amount: number;
  frequency: FrequencyEnum;
};