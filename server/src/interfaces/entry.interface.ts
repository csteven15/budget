import { Types } from 'mongoose';

export interface IEntry {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: number;
  budgetedAmount: number;
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
}
