import mongoose, { Schema, Document } from "mongoose";
import { EFrequency } from "../enums/EFrequency";

export interface IExpense extends Document {
  userId: string;
  budgetId: string;
  monthId: string;
  name: string;
  amount: number;
  isFixedAmount: boolean;
  frequency: EFrequency;
  maxAmount: number;
}

const expenseSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  budgetId: {
    type: String,
    required: true
  },
  monthId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  isFixedAmount: {
    type: Boolean,
    required: true
  },
  frequency: {
    type: String,
    enum: Object.values(EFrequency)
  },
  maxAmount: Number
});

export default mongoose.model<IExpense>("Expense", expenseSchema);