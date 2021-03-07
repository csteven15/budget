import { Types } from 'mongoose';

export interface IAccount {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: number;
  total: number;
  isAppliedToBudget: boolean;
}
