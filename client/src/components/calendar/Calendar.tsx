import React, { FC } from 'react'
import { Box, Center, SimpleGrid } from '@chakra-ui/react'
import { useQuery } from '@apollo/client'
import { EEntryType, MonthArray } from '../../common/enums'
import { GET_ENTRIES } from '../../common/gql/Queries'
import { IAmountInfo, IEntryInfo } from '../../common/gql/Types'
import Day from './Day'

const secondsInDay = 86400000

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const getAmountsOnDay = (entries: IEntryInfo[], date: Date): IAmountInfo[] =>
  entries
    ?.map((entry: IEntryInfo) =>
      entry?.amounts?.filter(
        (amount: IAmountInfo) => amount.date === date.toISOString()
      )
    )
    .flatMap((amounts) => amounts)

interface ICalendarProps {
  month: number
  startDate: Date
  endDate: Date
}

const Calendar: FC<ICalendarProps> = ({ month, startDate, endDate }) => {
  const { loading, data } = useQuery(GET_ENTRIES, {
    variables: {
      filter: {
        ...startDate,
        ...endDate,
      },
      payload: {},
    },
  })

  if (loading) {
    return <p>loading...</p>
  }

  const getNumberOfDays = (startDate: Date, endDate: Date) =>
    Math.floor((endDate.getTime() - startDate.getTime()) / secondsInDay)

  const dateIndex = new Date()

  const dates = Array.from(
    Array(getNumberOfDays(startDate, endDate)).keys()
  ).map(
    (day) =>
      new Date(dateIndex.setTime(startDate.getTime() + day * secondsInDay))
  )

  const incomeEntries: IEntryInfo[] = data?.entries?.filter(
    (entry: IEntryInfo) => entry.type === EEntryType.Income
  )
  const expenseEntries: IEntryInfo[] = data?.entries?.filter(
    (entry: IEntryInfo) => entry.type === EEntryType.Expense
  )

  const days = dates.map((date) => (
    <Day
      key={date.toString()}
      date={new Date(date)}
      incomeAmounts={getAmountsOnDay(incomeEntries, date)}
      expenseAmounts={getAmountsOnDay(expenseEntries, date)}
    />
  ))

  return (
    <div>
      <Center>{MonthArray[month]}</Center>
      <SimpleGrid columns={7}>
        {daysOfWeek.map((dayOfWeek: string) => (
          <Box key={dayOfWeek} textAlign="center">
            {dayOfWeek}
          </Box>
        ))}
        {days}
      </SimpleGrid>
    </div>
  )
}

export default Calendar
