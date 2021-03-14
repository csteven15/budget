import { EFrequencyType } from '../enums/EFrequencyType'
import { IAmount } from './index'

export interface IEntry {
  _id?: string
  userId: string
  name: string
  type: number
  budgetedAmount: number
  createdAt: Date
  startDate?: Date
  endDate?: Date
  frequency?: EFrequencyType
  amounts?: IAmount[]
}
