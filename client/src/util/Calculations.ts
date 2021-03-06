import { IAccount } from '../common/types'

export const getTotalAppliedToBudget = (accounts: IAccount[]) => {
  let total = 0
  const accountsApplied = accounts.filter(
    (account) => account.isAppliedToBudget === true
  )
  accountsApplied.forEach((account) => {
    total += account.total
  })
  return total
}

export const sumUp = (arrayOfNumbers: number[]) =>
  arrayOfNumbers.reduce((accumulator, curNumber) => accumulator + curNumber, 0)
