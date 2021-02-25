import React, { FC, useEffect, useReducer, useState } from 'react'
import {
  Typography,
  createStyles,
  makeStyles,
  Button,
  Theme,
  Grid,
  List,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core'
import { useEntry } from '../context/EntryContext'
import { MonthArray } from '../common/enums'
import { useAccount } from '../context/AccountContext'
import MonthView from './MonthView'
import {
  calculatedDataStoreReducer,
  ICalcualtedMonth,
  ICalculatedMonthState,
  setYearAction,
  updateEntriesAction,
} from '../store/CalculatedMonthDataStore'

const date = new Date()

const INITIAL_CALCULATED_MONTH: ICalcualtedMonth[] = MonthArray.map((_, i) => ({
  monthIndex: i,
  year: date.getFullYear(),
  monthlyIncome: [],
  monthlyExpense: [],
  incomeTotal: 0,
  expenseTotal: 0,
  endOfMonthTotal: 0,
  balance: 0,
}))

const INITIAL_STATE: ICalculatedMonthState = {
  calculatedMonthData: INITIAL_CALCULATED_MONTH,
  totalAccountAppliedToBudget: 0,
  month: date.getMonth(),
  year: date.getFullYear(),
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      maxHeight: '10vh',
    },
    monthViewContainer: {
      flex: '0 0 100%',
    },
    listSection: {
      position: 'relative',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
    li: {
      backgroundColor: 'inherit',
    },
    icon: {
      cursor: 'pointer',
    },
  })
)

const YearView: FC = () => {
  const [state, dispatch] = useReducer(
    calculatedDataStoreReducer,
    INITIAL_STATE
  )

  const { entries } = useEntry()
  const { accounts } = useAccount()
  const classes = useStyles()

  // on startup
  useEffect(() => {
    dispatch(setYearAction(date.getFullYear()))
  }, [])

  useEffect(() => {
    dispatch(updateEntriesAction(entries!, accounts!))
  }, [entries, accounts, state.year])

  const renderRow = (month: string, i: number) => {
    const [openMonthList, setOpenMonthList] = useState(false)
    return (
      <Accordion key={i} TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary>
          <Grid container onClick={() => setOpenMonthList(!openMonthList)}>
            <Grid item xs={4} md={4}>
              {month}
            </Grid>
            <Grid item xs={2} md={2}>
              {}
              {state.calculatedMonthData[i].incomeTotal}
            </Grid>
            <Grid item xs={2} md={2}>
              {state.calculatedMonthData[i].expenseTotal}
            </Grid>
            <Grid item xs={2} md={2}>
              {state.calculatedMonthData[i].balance}
            </Grid>
            <Grid item xs={2} md={2}>
              {state.calculatedMonthData[i].endOfMonthTotal}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.monthViewContainer}>
            <MonthView
              renderHeaders={false}
              propEntries={entries}
              propAccounts={accounts}
              month={i}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    )
  }

  const renderMonthData = () =>
    MonthArray.map((month, i) => renderRow(month, i))

  const renderYearViewData = () => {
    return (
      <List className={classes.listSection} subheader={<ul />}>
        <li className={classes.li}>
          <ul className={classes.ul}>
            <ListSubheader>
              <Grid container>
                <Grid item xs={4} md={4}>
                  Month
                </Grid>
                <Grid item xs={2} md={2}>
                  Income
                </Grid>
                <Grid item xs={2} md={2}>
                  Expenses
                </Grid>
                <Grid item xs={2} md={2}>
                  Balance
                </Grid>
                <Grid item xs={2} md={2}>
                  Total In Bank
                </Grid>
              </Grid>
            </ListSubheader>
            {renderMonthData()}
          </ul>
        </li>
      </List>
    )
  }

  return (
    <>
      <div className={classes.header}>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch(setYearAction(state.year - 1))}
        >
          Prev Year
        </Button>
        <Typography align="center">{state.year}</Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => dispatch(setYearAction(state.year + 1))}
        >
          Next Year
        </Button>
      </div>
      {renderYearViewData()}
    </>
  )
}

export default YearView
