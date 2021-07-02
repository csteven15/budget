import { IAmount } from '../types/IAmount'

export interface IEntryInfo {
  _id: string
  name: string
  type: number
  budgetedAmount: number
  createdAt: string
  startDate: string
  endDate: string
  amounts: IAmountInfo[]
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
  date: string
  paid: boolean
}

export interface DayInfo {
  amounts: IAmountInfo[]
  name: string
}
