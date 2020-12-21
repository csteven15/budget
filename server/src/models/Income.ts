import mongoose, { Schema, Document } from "mongoose"
import { EFrequency } from "../enums/EFrequency"

export interface IIncome extends Document {
  name: string
  amount: number
  frequency: EFrequency
}

const incomeSchema: Schema = new mongoose.Schema({
  name: String,
  amount: Number,
  frequency: {
    type: String,
    enum: Object.values(EFrequency)
  }
})

export default mongoose.model<IIncome>("Income", incomeSchema)