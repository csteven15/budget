import React, { FC, useState } from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core'
import {
  Chart,
  PieSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui'
import { Animation } from '@devexpress/dx-react-chart'

import { useEntry } from '../context/EntryContext'
import { EInputType } from '../common/enums'
import { IEntry } from '../common/types'

interface chartType {
  name: string
  value: number
}

const defaultChartState: chartType[] = []
const TotalView: FC = () => {
  const { entries } = useEntry()
  const [showPercent, setShowPercent] = useState(false)
  let chartData: chartType[] = defaultChartState

  const setOfYears = new Set<number>()
  entries.forEach((entry) => {
    setOfYears.add(entry.year)
  })
  const years: number[] = Array.from(setOfYears.values())

  const getTotalFromInputType = (entriesForYear: IEntry[]) => {
    let total = 0
    entriesForYear.forEach((entry) => {
      total += entry.monthlyAmount.reduce(
        (accumulator: number, monthlyAmount: number) =>
          accumulator + monthlyAmount,
        0
      )
    })
    return total
  }

  const togglePercentsFromIncome = (
    incomeTotal: number,
    otherTotal: number
  ) => {
    if (showPercent) {
      return (otherTotal / incomeTotal) * 100.0
    } else {
      return otherTotal
    }
  }

  const renderRows = () => {
    return years.map((year) => {
      const entryForYear = entries.filter((entry) => entry.year === year)
      const incomeForEntryForYear = entryForYear.filter(
        (entry) => entry.inputType === EInputType.Income
      )
      const expensesForEntryForYear = entryForYear.filter(
        (entry) => entry.inputType === EInputType.Expense
      )
      const totalIncomeForYear = getTotalFromInputType(incomeForEntryForYear)
      const totalExpensesForYear = getTotalFromInputType(
        expensesForEntryForYear
      )

      const incomeTotal = togglePercentsFromIncome(
        totalIncomeForYear,
        totalIncomeForYear
      )
      const expenseTotal = togglePercentsFromIncome(
        totalIncomeForYear,
        totalExpensesForYear
      )
      const savingsTotal = togglePercentsFromIncome(
        totalIncomeForYear,
        totalIncomeForYear - totalExpensesForYear
      )

      const expenseLabel = year + ' Expenses'
      const savingsLabel = year + ' Savings'
      chartData = [...chartData, { name: expenseLabel, value: expenseTotal }]
      chartData = [...chartData, { name: savingsLabel, value: savingsTotal }]

      return (
        <TableRow key={year}>
          <TableCell>{year}</TableCell>
          <TableCell>
            {incomeTotal.toFixed(2)}
            {showPercent ? '%' : ''}
          </TableCell>
          <TableCell>
            {expenseTotal.toFixed(2)}
            {showPercent ? '%' : ''}
          </TableCell>
          <TableCell>
            {savingsTotal.toFixed(2)}
            {showPercent ? '%' : ''}
          </TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      )
    })
  }

  return (
    <Paper>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setShowPercent(!showPercent)}
      >
        Show Percentages
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell>Income Total</TableCell>
              <TableCell>Expense Total</TableCell>
              <TableCell>Savings Total</TableCell>
              <TableCell>Total In Bank</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
      <Chart data={chartData}>
        <PieSeries name="Pie" valueField="value" argumentField="name">
          <Title text="Pie Chart"></Title>
        </PieSeries>
        <Animation />
        <Legend position="left" />
      </Chart>
    </Paper>
  )
}

export default TotalView
