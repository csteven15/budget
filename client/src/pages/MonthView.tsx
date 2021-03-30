import React, { FC } from 'react'
import { useQuery } from '@apollo/client'
import { Box, SimpleGrid, Center } from '@chakra-ui/react'
import { EEntryType, MonthArray } from '../common/enums/index'
import { IAmount, IEntry } from '../common/types/index'
import { GET_ENTRIES } from '../common/gql/Queries'

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

interface DayComponentProps {
  day?: Date
  income?: number[]
  expenses?: number[]
}

const DayComponent: FC<DayComponentProps> = ({ day, income, expenses }) => {
  return (
    <Box borderWidth="1px" minW="50px" h="125px">
      <Box textAlign="right">{day?.getDate()}</Box>
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
  const { data: entriesForMonth } = useQuery(GET_ENTRIES, {
    variables: {
      filter: {
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      },
      payload: {},
    },
  })
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

  const income = entriesForMonth?.entries?.filter(
    (entry: IEntry) => entry.type === EEntryType.Income
  )
  const expenses = entriesForMonth?.entries?.filter(
    (entry: IEntry) => entry.type === EEntryType.Expense
  )

  date.setDate(1)
  const daysComponentsPriorToMonth: Array<JSX.Element> = []
  for (let i = 0; i < date.getDay() - 1; i++) {
    daysComponentsPriorToMonth.push(
      <DayComponent
        key={i}
        day={
          new Date(date.getFullYear(), date.getMonth(), -(date.getDay() - i))
        }
      />
    )
  }

  const dayComponents = Array.from(Array(daysInMonth).keys()).map((i) => (
    <DayComponent
      key={i}
      day={new Date(date.getFullYear(), date.getMonth(), i)}
      income={getAmountsOnDay(income, i)}
      expenses={getAmountsOnDay(expenses, i)}
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
        {daysComponentsPriorToMonth}
        {dayComponents}
      </SimpleGrid>
    </div>
  )
}

export default MonthView
