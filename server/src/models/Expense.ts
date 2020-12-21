import mongoose, { Schema, Document } from "mongoose"
import { EFrequency } from "../enums/EFrequency"

export interface IExpense extends Document {
  name: string
  amount: number
  isFixedAmount: boolean
  frequency: EFrequency
  maxAmount: number
}

const expenseSchema: Schema = new mongoose.Schema({
  name: String,
  amount: Number,
  isFixedAmount: Boolean,
  frequency: {
    type: String,
    enum: Object.values(EFrequency)
  },
  maxAmount: Number
})

export default mongoose.model<IExpense>("Expense", expenseSchema)