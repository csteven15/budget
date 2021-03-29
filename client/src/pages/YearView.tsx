import React, { FC } from 'react'
import { useQuery } from '@apollo/client'
import { Table, Thead, Tbody, Tr, Th, TableCaption } from '@chakra-ui/react'
import { EEntryType } from '../common/enums/index'
import { MonthArray } from '../common/enums/index'
import { GET_ENTRIES } from '../common/gql/Queries'
import { IEntryInfo } from '../common/gql/Types'

interface MonthTotalsProps {
  date: Date
}

const MonthTotals: FC<MonthTotalsProps> = ({ date }) => {
  const filter = {
    startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  }
  const { data, loading } = useQuery(GET_ENTRIES, {
    variables: {
      filter: filter,
      payload: {
        type: EEntryType.Income,
      },
    },
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return (
      <Tr>
        <Th>0</Th>
        <Th>0</Th>
        <Th>0</Th>
        <Th>0</Th>
        <Th>0</Th>
        <Th>0</Th>
        <Th>-</Th>
      </Tr>
    )
  }

  const getBudgetedTotal = (entries?: IEntryInfo[]) => {
    return entries?.reduce(
      (accumulator, cur) => accumulator + cur.budgetedAmount,
      0
    )
  }

  const getActualTotal = (entries?: IEntryInfo[]) => {
    const totals = entries?.map((entry: IEntryInfo) =>
      entry.amounts.reduce((accumulator, cur) => accumulator + cur.amount, 0)
    )
    return totals?.reduce((accumulator, cur) => accumulator + cur, 0)
  }

  const incomes = data?.entries?.filter(
    (entry: IEntryInfo) => entry.type === EEntryType.Income
  )
  const expenses = data?.entries?.filter(
    (entry: IEntryInfo) => entry.type === EEntryType.Expense
  )

  const budgetedTotalIncomes = getBudgetedTotal(incomes)
  const actualTotalIncomes = getActualTotal(incomes)

  const budgetedTotalExpenses = getBudgetedTotal(expenses)
  const actualTotalExpenses = getActualTotal(expenses)

  const balance = (actualTotalIncomes ?? 0) - (actualTotalExpenses ?? 0)

  return (
    <Tr>
      <Th>{MonthArray[date.getMonth()]}</Th>
      <Th>{budgetedTotalIncomes ?? 0}</Th>
      <Th>{actualTotalIncomes ?? 0}</Th>
      <Th>{budgetedTotalExpenses ?? 0}</Th>
      <Th>{actualTotalExpenses ?? 0}</Th>
      <Th>{balance}</Th>
      <Th>-</Th>
    </Tr>
  )
}

interface YearViewProps {
  date: Date
}

const YearView: FC<YearViewProps> = ({ date }) => {
  return (
    <Table variant="striped" size="md">
      <TableCaption placement="top">{date.getFullYear()}</TableCaption>
      <Thead>
        <Tr>
          <Th>Month</Th>
          <Th>Budgeted Income</Th>
          <Th>Actual Income</Th>
          <Th>Budgeted Expenses</Th>
          <Th>Actual Expenses</Th>
          <Th>Balance</Th>
          <Th>Total In Bank</Th>
        </Tr>
      </Thead>
      <Tbody>
        {MonthArray.map((month: string, i: number) => (
          <MonthTotals
            key={i}
            date={
              new Date(date.getFullYear(), MonthArray.indexOf(month) + 1, 0)
            }
          />
        ))}
      </Tbody>
    </Table>
  )
}

export default YearView
