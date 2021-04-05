import React, { FC } from 'react'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { EEntryType } from '../../common/enums'
import { IAmountInfo, IEntryInfo } from '../../common/gql/Types'
import Day from './Day'
import { useEntryQueryCalendar } from '../../hooks/useEntryQuery'

const secondsInDay = 86400000

const daysOfWeek = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur', 'Fri.', 'Sat.']

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
  const { isLoading, data } = useEntryQueryCalendar(startDate, endDate)

  if (isLoading) {
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
      month={month}
      date={new Date(date)}
      incomeAmounts={getAmountsOnDay(incomeEntries, date)}
      expenseAmounts={getAmountsOnDay(expenseEntries, date)}
    />
  ))

  return (
    <SimpleGrid columns={7}>
      {daysOfWeek.map((dayOfWeek: string) => (
        <Box key={dayOfWeek} textAlign="center">
          <Text>{dayOfWeek}</Text>
        </Box>
      ))}
      {days}
    </SimpleGrid>
  )
}

export default Calendar
