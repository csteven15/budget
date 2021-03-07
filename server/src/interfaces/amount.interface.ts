import { Types } from 'mongoose';

export interface IAccount {
  _id: Types.ObjectId;
  entryId: Types.ObjectId;
  date: Date;
  amount: number;
  isPaid: boolean;
}
