import mongoose, { Schema, Document } from "mongoose";

export interface IMonth extends Document {
  userId: string;
  budgetId: string;
  name: string;
}

const monthSchema: Schema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model<IMonth>("Month", monthSchema);