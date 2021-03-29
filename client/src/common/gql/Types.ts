import { IAmount } from '../types/IAmount'

export interface IEntryInfo {
  _id: string
  name: string
  type: number
  budgetedAmount: number
  createdAt: Date
  startDate: Date
  endDate: Date
  amounts: IAmount[]
}

export interface IAccountInfo {
  _id: string
  userId: string
  name: string
  total: number
  type: number
  appliedToBudget: boolean
}

export interface IAmountInfo {
  _id: string
  amount: number
  date: Date
  paid: boolean
}
