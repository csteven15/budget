import mongoose, { Schema, Document } from "mongoose"
import { IMonth } from "./Month"

export interface IBudget extends Document {
  year: number
  months: Array<IMonth>
}

const budgetSchema: Schema = new mongoose.Schema({
  year: Number,
  months: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month"
  }]
})

export default mongoose.model<IBudget>("Budget", budgetSchema)