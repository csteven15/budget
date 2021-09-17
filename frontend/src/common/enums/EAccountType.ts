import { TextToValue } from './Generic'

enum EAccountType {
  Checking,
  Savings,
  Investment,
  Retirement,
}

const EAccountValues: TextToValue[] = [
  { value: EAccountType.Checking, text: 'Checking' },
  { value: EAccountType.Savings, text: 'Savings' },
  { value: EAccountType.Investment, text: 'Investment' },
  { value: EAccountType.Retirement, text: 'Retirement' },
]

export { EAccountType, EAccountValues }
