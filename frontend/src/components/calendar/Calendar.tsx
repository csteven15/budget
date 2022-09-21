import { FC } from 'react'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import Day from './Day'
import { DayAmountInfo } from '../../common/types/DayAmountInfo'

const secondsInDay = 86400000

const daysOfWeek = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur', 'Fri.', 'Sat.']

const dateIsSame = (someDate: Date, otherDate: Date) => {
  return (
    someDate.getDate() == otherDate.getDate() &&
    someDate.getMonth() == otherDate.getMonth() &&
    someDate.getFullYear() == otherDate.getFullYear()
  )
}

interface ICalendarProps {
  month: number
  startDate: Date
  endDate: Date
  onDayClick: (date: Date) => void
  dayAmounts: DayAmountInfo[]
}

const Calendar: FC<ICalendarProps> = ({
  month,
  startDate,
  endDate,
  onDayClick,
  dayAmounts,
}) => {
  const getNumberOfDays = (startDate: Date, endDate: Date) =>
    Math.floor((endDate.getTime() - startDate.getTime()) / secondsInDay)

  const dateIndex = new Date()

  const dates = Array.from(
    Array(getNumberOfDays(startDate, endDate)).keys()
  ).map(
    (day) =>
      new Date(dateIndex.setTime(startDate.getTime() + day * secondsInDay))
  )

  const getDayInfoFor = (date: Date) => {
    const possibleAmountInfo = dayAmounts.find((info) =>
      dateIsSame(new Date(info.date), new Date(date))
    )
    const defaultInfo: DayAmountInfo = {
      date: date,
      income: [0],
      expenses: [0],
      runningBalance: 0,
    }
    return possibleAmountInfo === undefined ? defaultInfo : possibleAmountInfo
  }

  const days = dates.map((date) => (
    <Day
      key={date.toString()}
      month={month}
      date={new Date(date)}
      incomeTotal={getDayInfoFor(date).income.reduce((a, b) => a + b, 0)}
      expenseTotal={getDayInfoFor(date).expenses.reduce((a, b) => a + b, 0)}
      runningBalance={getDayInfoFor(date).runningBalance}
      onClick={onDayClick}
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
