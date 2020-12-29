import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  budgetId: string;
  monthId: string;
  name: string;
  amount: number;
  frequency: string;
}

const incomeSchema: Schema = new mongoose.Schema({
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
  frequency: {
    type: String,
    required: true
  }
});

export default mongoose.model<IIncome>("Income", incomeSchema);