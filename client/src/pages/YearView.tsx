import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Table, Thead, Tbody, Tr, Th, TableCaption } from '@chakra-ui/react'
import { EEntryType } from '../common/enums/index'
import { IAmount, IEntry } from '../common/types'
import { MonthArray } from '../common/enums/index'

const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput) {
    entries(filter: $filter, payload: $payload) {
      name
      _id
      type
      budgetedAmount
      startDate
      endDate
      createdAt
      amounts {
        amount
        date
        paid
      }
    }
  }
`

const queryByTypeByMonth = (type: EEntryType, date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return {
    variables: {
      filter: {
        startDate: firstDay,
        endDate: lastDay,
      },
      payload: {
        type: type,
      },
    },
  }
}

interface MonthTotalsProps {
  date: Date
}

interface TotalType {
  budgetedTotal: number
  actualTotal: number
}

const MonthTotals: FC<MonthTotalsProps> = ({ date }) => {
  const incomeEntries = useQuery(
    GET_ENTRIES,
    queryByTypeByMonth(EEntryType.Income, date)
  )
  const expenseEntries = useQuery(
    GET_ENTRIES,
    queryByTypeByMonth(EEntryType.Expense, date)
  )

  const getTotals = (entries: IEntry[]) => {
    const total: TotalType = { budgetedTotal: 0, actualTotal: 0 }
    entries?.forEach((entry: IEntry) => {
      total.budgetedTotal = entry.budgetedAmount
      if (entry.amounts) {
        total.actualTotal += entry?.amounts.reduce(
          (total: number, i: IAmount) => (total += i.amount),
          0
        )
      }
    })
    return total
  }

  const totalIncome = getTotals(incomeEntries.data?.entries)
  const totalExpenses = getTotals(expenseEntries.data?.entries)
  return (
    <Tr>
      <Th>{MonthArray[date.getMonth()]}</Th>
      <Th>{totalIncome.budgetedTotal}</Th>
      <Th>{totalIncome.actualTotal}</Th>
      <Th>{totalExpenses.budgetedTotal}</Th>
      <Th>{totalExpenses.actualTotal}</Th>
      <Th>{totalIncome.actualTotal - totalExpenses.actualTotal}</Th>
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
        {MonthArray.map((month: string, i: number) => {
          return (
            <MonthTotals
              key={i}
              date={
                new Date(date.getFullYear(), MonthArray.indexOf(month) + 1, 0)
              }
            />
          )
        })}
      </Tbody>
    </Table>
  )
}

export default YearView
