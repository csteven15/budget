import { TextToValue } from './Generic'

export enum EEntryType {
  Income,
  Expense,
}

export const EEntryValues: TextToValue[] = [
  { value: EEntryType.Income, text: 'Income' },
  { value: EEntryType.Expense, text: 'Expense' },
]
