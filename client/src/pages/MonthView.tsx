import React, { FC, useState, useEffect } from 'react'
import {
  Paper,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
} from '@material-ui/core'
import { EInputType, MonthArray } from '../common/enums'
import { useEntry } from '../context/EntryContext'

const MonthView: FC = () => {
  const { entries } = useEntry()
  const [monthIndex, setMonthIndex] = useState(0)
  const [yearShown, setYearShown] = useState(0)

  const date = new Date()
  // do once
  useEffect(() => {
    setMonth(date.getMonth())
    setYearShown(date.getFullYear())
  }, [])

  const getMonthAndYearString = () => {
    return MonthArray[monthIndex] + ' ' + yearShown.toString()
  }

  const setMonth = (index: number) => {
    setMonthIndex(index)
    date.setMonth(index)
  }

  const getNextMonthIndex = () => {
    let index = monthIndex + 1
    if (index > 11) {
      setYearShown(yearShown + 1)
      index = 0
    }
    return index
  }

  const getPreviousMonthIndex = () => {
    let index = monthIndex - 1
    if (index < 0) {
      setYearShown(yearShown - 1)
      index = 11
    }
    return index
  }

  const renderListOfEntriesPerType = (inputType: EInputType) => {
    return entries
      .filter((entry) => entry.inputType === inputType)
      .filter((entry) => entry.year === yearShown)
      .map((entry, i) => {
        return (
          <ListItem key={i}>
            <Grid container>
              <Grid item xs={2} sm={3} md={6}>
                {entry.name}
              </Grid>
              <Grid item xs={2} sm={3} md={6}>
                {entry.monthlyAmount[monthIndex]}
              </Grid>
            </Grid>
          </ListItem>
        )
      })
  }

  return (
    <Paper>
      <Typography align="center">{getMonthAndYearString()}</Typography>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => setMonth(getPreviousMonthIndex())}
        >
          Previous Month
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setMonth(getNextMonthIndex())}
        >
          Next Month
        </Button>
      </Grid>
      <List>
        <Typography align="center">Income</Typography>
        {renderListOfEntriesPerType(EInputType.Income)}
        <Typography align="center">Expenses</Typography>
        {renderListOfEntriesPerType(EInputType.Expense)}
      </List>
    </Paper>
  )
}

export default MonthView
