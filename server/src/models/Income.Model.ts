import mongoose, { Schema, Document } from "mongoose";
import { EFrequency } from "../enums/EFrequency";

export interface IIncome extends Document {
  userId: string;
  budgetId: string;
  monthId: string;
  name: string;
  amount: number;
  frequency: EFrequency;
}

const incomeSchema: Schema = new mongoose.Schema({
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
  frequency: {
    type: String,
    enum: Object.values(EFrequency),
    required: true
  }
});

export default mongoose.model<IIncome>("Income", incomeSchema);