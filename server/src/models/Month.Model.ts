import mongoose, { Schema, Document } from "mongoose";

export interface IMonth extends Document {
  budgetId: string;
  name: string;
  incomes: Array<string>;
  expenses: Array<string>;
}

const monthSchema: Schema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  incomes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Income"
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expense"
  }]
});

export default mongoose.model<IMonth>("Month", monthSchema);