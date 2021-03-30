import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Box, SimpleGrid, Center } from '@chakra-ui/react'
import { EEntryType, MonthArray } from '../common/enums/index'
import { IAmount, IEntry } from '../common/types'

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const GET_ENTRIES_MONTH = gql`
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
    options: {
      fetchPolicy: 'no-cache',
    },
  }
}

interface DayComponentProps {
  day: Date
  income?: number[]
  expenses?: number[]
}

const DayComponent: FC<DayComponentProps> = ({ day, income, expenses }) => {
  return (
    <Box borderWidth="1px" minW="50px" h="125px">
      <Box textAlign="right">{day.getDate()}</Box>
      {income?.map((amount: number, i: number) => {
        return (
          <Box key={i} textAlign="center">
            + {amount}
          </Box>
        )
      })}
      {expenses?.map((amount: number, i: number) => {
        return (
          <Box key={i} textAlign="center">
            - {amount}
          </Box>
        )
      })}
    </Box>
  )
}

interface MonthViewProps {
  date: Date
}

const MonthView: FC<MonthViewProps> = ({ date }) => {
  const incomeEntries = useQuery(
    GET_ENTRIES_MONTH,
    queryByTypeByMonth(EEntryType.Income, date)
  )
  const expenseEntries = useQuery(
    GET_ENTRIES_MONTH,
    queryByTypeByMonth(EEntryType.Expense, date)
  )
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()

  const getAmountsOnDay = (entries: IEntry[], day: number) => {
    const amounts: number[] = []
    entries?.map((entry: IEntry) => {
      if (entry.amounts !== undefined && entry.amounts?.length > 0) {
        entry.amounts?.map((amount: IAmount) => {
          const amountDate = new Date(amount.date)
          if (amountDate.getDate() === day) {
            amounts.push(amount.amount)
          }
        })
      }
    })
    return amounts
  }

  const dayComponents = Array.from(Array(daysInMonth).keys()).map((i) => (
    <DayComponent
      key={i}
      day={new Date(date.getFullYear(), date.getMonth(), i)}
      income={getAmountsOnDay(incomeEntries.data?.entries, i)}
      expenses={getAmountsOnDay(expenseEntries.data?.entries, i)}
    />
  ))
  return (
    <div>
      <Center>{MonthArray[date.getMonth()]}</Center>
      <SimpleGrid columns={7}>
        {daysOfWeek.map((day: string) => (
          <Box key={day} textAlign="center">
            {day}
          </Box>
        ))}
        {dayComponents}
      </SimpleGrid>
    </div>
  )
}

export default MonthView
