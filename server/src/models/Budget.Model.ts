import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  userId: string;
  year: number;
  months?: Array<string>;
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
  months: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month",
    required: true
  }]
});

export default mongoose.model<IBudget>("Budget", budgetSchema);