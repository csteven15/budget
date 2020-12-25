import mongoose, { Schema, Document } from "mongoose";
import { EMonth } from "../enums/EMonth";

export interface IMonth extends Document {
  userId: string;
  budgetId: string;
  name: EMonth;
}

const monthSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  budgetId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    enum: Object.values(EMonth)
  }
});

export default mongoose.model<IMonth>("Month", monthSchema);