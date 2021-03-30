import React, { FC } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '../context/AuthContext'
import { Table, Thead, Tbody, Tr, Th, TableCaption } from '@chakra-ui/react'
import { EEntryType, MonthArray } from '../common/enums/index'
import { IEntry, IAmount, IAccount } from '../common/types/index'
import { GET_ENTRIES, GET_ACCOUNTS } from '../common/gql/Queries'

interface TotalType {
  budgeted: number
  actual: number
}

interface MonthInfoProps {
  header: string
  budgetedIncome: string
  actualIncome: string
  budgetedExpenses: string
  actualExpenses: string
  balance: string
  totalInBank: string
}

const MonthInfo: FC<MonthInfoProps> = ({
  header,
  budgetedIncome,
  actualIncome,
  budgetedExpenses,
  actualExpenses,
  balance,
  totalInBank,
}) => {
  return (
    <Tr>
      <Th>{header}</Th>
      <Th>{budgetedIncome}</Th>
      <Th>{actualIncome}</Th>
      <Th>{budgetedExpenses}</Th>
      <Th>{actualExpenses}</Th>
      <Th>{balance}</Th>
      <Th>{totalInBank}</Th>
    </Tr>
  )
}

interface YearViewProps {
  date: Date
}

const YearView: FC<YearViewProps> = ({ date }) => {
  const { user } = useAuth()
  const { data: appliedAccounts } = useQuery(GET_ACCOUNTS, {
    variables: {
      payload: {
        userId: user.uid,
        appliedToBudget: true,
      },
    },
  })
  const { data: entriesForYear } = useQuery(GET_ENTRIES, {
    variables: {
      filter: {
        startDate: new Date(date.getFullYear(), 0, 1),
        endDate: new Date(date.getFullYear() + 1, 0, 0),
      },
      payload: {},
    },
  })
  const getTotalsForEachMonth = (entries: IEntry[]) => {
    const totals: TotalType[] = []
    for (let i = 0; i < MonthArray.length; i++) {
      const total: TotalType = { budgeted: 0, actual: 0 }
      entries?.forEach((entry: IEntry) => {
        entry?.amounts?.forEach((amount: IAmount) => {
          if (new Date(amount.date).getMonth() === i) {
            total.budgeted += entry.budgetedAmount
            total.actual += amount.amount
          }
        })
      })
      totals.push(total)
    }
    return totals
  }
  const getEndOfMonthTotals = (
    totalInBank: number,
    income: TotalType[],
    expense: TotalType[]
  ) => {
    const totals: number[] = []
    let lastMonthTotal = totalInBank
    for (let i = 0; i < MonthArray.length; i++) {
      const endOfMonthBankTotal =
        lastMonthTotal + (income[i].actual - expense[i].actual)
      totals.push(endOfMonthBankTotal)
      lastMonthTotal = endOfMonthBankTotal
    }
    return totals
  }
  const income = entriesForYear?.entries?.filter(
    (entry: IEntry) => entry.type === EEntryType.Income
  )
  const expenses = entriesForYear?.entries?.filter(
    (entry: IEntry) => entry.type === EEntryType.Expense
  )
  const incomeTotals = getTotalsForEachMonth(income)
  const expenseTotals = getTotalsForEachMonth(expenses)
  const endOfMonthBankTotals = getEndOfMonthTotals(
    appliedAccounts?.accounts?.reduce(
      (total: number, account: IAccount) => (total += account.total),
      0
    ),
    incomeTotals,
    expenseTotals
  )
  return (
    <Table variant="striped" size="md">
      <TableCaption placement="top">{date.getFullYear()}</TableCaption>
      <Thead>
        <MonthInfo
          header={'Month'}
          budgetedIncome={'Budgeted Income'}
          actualIncome={'Actual Income'}
          budgetedExpenses={'Budgeted Expenses'}
          actualExpenses={'Actual Expenses'}
          balance={'Balance'}
          totalInBank={'Total In Bank'}
        />
      </Thead>
      <Tbody>
        {MonthArray.map((month: string, i: number) => {
          return (
            <MonthInfo
              key={i}
              header={month}
              budgetedIncome={incomeTotals[i].budgeted.toString()}
              actualIncome={incomeTotals[i].actual.toString()}
              budgetedExpenses={expenseTotals[i].budgeted.toString()}
              actualExpenses={expenseTotals[i].actual.toString()}
              balance={(
                incomeTotals[i].actual - expenseTotals[i].actual
              ).toString()}
              totalInBank={endOfMonthBankTotals[i].toString()}
            />
          )
        })}
      </Tbody>
    </Table>
  )
}

export default YearView