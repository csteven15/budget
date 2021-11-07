import { FC } from 'react'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'

import Day from './Day'

import { IAmountInfo, IEntryInfo, DayInfo } from '../../common/gql/Types'
import { useQuery } from 'react-query'

const secondsInDay = 86400000

const daysOfWeek = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur', 'Fri.', 'Sat.']

const getEntriesOnDay = (entries: IEntryInfo[], date: Date) => {
  const dayInfo: DayInfo[] = []
  entries?.map((entry: IEntryInfo) => {
    const amounts = entry?.amounts?.filter(
      (amount: IAmountInfo) => amount.date === date.toISOString()
    )
    dayInfo.push({ amounts: amounts, name: entry?.name })
  })
  return dayInfo
}

interface ICalendarProps {
  month: number
  startDate: Date
  endDate: Date
}

const Calendar: FC<ICalendarProps> = ({ month, startDate, endDate }) => {
  const { isLoading } = useQuery({})

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

  const incomeEntries: IEntryInfo[] = []
  const expenseEntries: IEntryInfo[] = []

  const days = dates.map((date) => (
    <Day
      key={date.toString()}
      month={month}
      date={new Date(date)}
      incomeAmounts={getEntriesOnDay(incomeEntries, date)}
      expenseAmounts={getEntriesOnDay(expenseEntries, date)}
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
