import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  userId: string;
  year: number;
}

const budgetSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  year: {
    type: Number,
    required: true
  },
});

export default mongoose.model<IBudget>("Budget", budgetSchema);