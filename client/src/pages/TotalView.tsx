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
import { useEntry } from '../context/EntryContext'
import { EInputType } from '../common/enums'
import { IEntry } from '../common/types'

const TotalView: FC = () => {
  const { entries } = useEntry()
  const [showPercent, setShowPercent] = useState(false)

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
      return (
        <TableRow key={year}>
          <TableCell>{year}</TableCell>
          <TableCell>
            {togglePercentsFromIncome(
              totalIncomeForYear,
              totalIncomeForYear
            ).toFixed(2)}
            {showPercent ? '%' : ''}
          </TableCell>
          <TableCell>
            {togglePercentsFromIncome(
              totalIncomeForYear,
              totalExpensesForYear
            ).toFixed(2)}
            {showPercent ? '%' : ''}
          </TableCell>
          <TableCell>
            {togglePercentsFromIncome(
              totalIncomeForYear,
              totalIncomeForYear - totalExpensesForYear
            ).toFixed(2)}
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
        Show Percentages from Income
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
    </Paper>
  )
}

export default TotalView
