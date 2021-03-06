export interface IEntry {
  _id?: string
  uid: string
  name: string
  year: number
  inputType: number
  maxAmount: number
  monthlyAmount: number[]

  // these are used in the form
  isFixed?: boolean
  amount?: number
  January?: number
  February?: number
  March?: number
  April?: number
  May?: number
  June?: number
  July?: number
  August?: number
  September?: number
  October?: number
  November?: number
  December?: number
}
