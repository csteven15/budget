import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  userId: string;
  budgetId: string;
  monthId: string;
  name: string;
  amount: number;
  isFixedAmount: boolean;
  frequency: string;
  maxAmount: number;
}

const expenseSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true
  },
  monthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month",
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
    default: undefined
  },
  maxAmount: Number
});

export default mongoose.model<IExpense>("Expense", expenseSchema);