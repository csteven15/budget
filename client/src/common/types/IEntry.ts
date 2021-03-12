import { EFrequencyType } from '../enums/EFrequencyType'

export interface IEntry {
  _id?: string
  userId: string
  name: string
  type: number
  budgetedAmount: number
  createdAt: Date
  startDate?: Date
  endDate?: Date
  frequency: EFrequencyType
}
