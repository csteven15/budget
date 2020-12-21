import mongoose, { Schema, Document } from "mongoose"
import { IIncome } from "./Income"
import { IExpense } from "./Expense"
import { EMonth } from "../enums/EMonth"

export interface IMonth extends Document {
  name: EMonth
  income: Array<IIncome>
  expense: Array<IExpense>
}

const monthSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    enum: Object.values(EMonth)
  },
  income: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Income"
  }],
  expense: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expense"
  }]
})

export default mongoose.model<IMonth>("Month", monthSchema)