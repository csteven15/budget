import { FC } from 'react'
import { DayAmountInfo } from '../common/types/DayAmountInfo'

import Calendar from '../components/calendar/Calendar'

interface IDateRange {
  startDate: Date
  endDate: Date
}

const getDateRange = (date: Date): IDateRange => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const priorMonthDays = firstDayOfMonth.getDay()
  const nextMonthDays = lastDayOfMonth.getDay()
  const startDate = new Date(
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - priorMonthDays)
  )
  const endDate = new Date(
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + (7 - nextMonthDays))
  )
  return { startDate, endDate }
}

interface IMonthViewProps {
  date: Date
  onDayClick: (date: Date) => void
  dayAmounts: DayAmountInfo[]
}

const MonthView: FC<IMonthViewProps> = ({ date, onDayClick, dayAmounts }) => {
  const dateRange = getDateRange(date)
  return (
    <div>
      <Calendar
        month={date.getMonth()}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onDayClick={onDayClick}
        dayAmounts={dayAmounts}
      />
    </div>
  )
}

export default MonthView
