enum EAccountType {
  Checking,
  Savings,
  Investment,
  Retirement,
}

const AccountTypeArray = [
  { value: 0, text: 'Checking' },
  { value: 1, text: 'Savings' },
  { value: 2, text: 'Investment' },
  { value: 3, text: 'Retirement' },
]

export { EAccountType, AccountTypeArray }
