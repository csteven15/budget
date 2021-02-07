import React, { FC, useEffect, useReducer, useState } from 'react'
import {
  Paper,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListSubheader,
  Checkbox,
  createStyles,
  makeStyles,
  Theme,
  Modal,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { EInputType, MonthArray } from '../common/enums'
import { useEntry } from '../context/EntryContext'
import {
  IMonthViewState,
  monthViewReducer,
  nextMonthAction,
  prevMonthAction,
  setYearAction,
  updateEntriesAction,
} from '../store/MonthViewStore'
import { IEntry } from '../common/types'
import EntryForm from '../components/forms/Entry'

const date = new Date()

const INITIAL_STATE: IMonthViewState = {
  monthIndex: date.getMonth(),
  year: date.getFullYear(),
  entries: [],
  monthlyIncome: [],
  monthlyExpense: [],
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      maxHeight: '10vh',
    },
    listSection: {
      position: 'relative',
      overflow: 'auto',
      maxHeight: '70vh',
      backgroundColor: theme.palette.background.paper,
    },
    ul: {
      backgroundColor: 'inherit',
      // padding: 0,
    },
    li: {
      backgroundColor: 'inherit',
      // padding: 0,
    },
    icon: {
      cursor: 'pointer',
    },
  })
)

interface IModalState {
  isOpen: boolean
  entry: IEntry | undefined
}

const defaultModalState: IModalState = {
  isOpen: false,
  entry: undefined,
}

const MonthView: FC = () => {
  const [state, dispatch] = useReducer(monthViewReducer, INITIAL_STATE)
  const [modalState, openModal] = useState<IModalState>(defaultModalState)

  const { entries } = useEntry()
  const classes = useStyles()

  const handleModalOpen = (entry: IEntry) => {
    openModal({ isOpen: true, entry: entry })
  }

  const handleModalClose = () => {
    openModal({ isOpen: false, entry: undefined })
  }

  // on startup
  useEffect(() => {
    dispatch(setYearAction(date.getFullYear(), entries))
  }, [])

  useEffect(() => {
    dispatch(updateEntriesAction(entries))
  }, [entries])

  const getMonthAndYearString = () =>
    MonthArray[state.monthIndex] + ' ' + state.year.toString()

  const renderListOfEntriesPerType = (inputType: EInputType) => {
    const entriesToRender =
      inputType === EInputType.Income
        ? state.monthlyIncome
        : state.monthlyExpense
    return (
      <li className={classes.li}>
        <ul className={classes.ul}>
          <ListSubheader>
            <Grid container>
              <Grid item xs={4} md={4}>
                {inputType === EInputType.Income ? 'Income' : 'Expense'}
              </Grid>
              <Grid item xs={4} md={4}>
                Amount
              </Grid>
              <Grid item xs={2} md={2}>
                Paid
              </Grid>
              <Grid item xs={2} md={2}>
                Edit
              </Grid>
            </Grid>
          </ListSubheader>
          {entriesToRender.map((entry, i) => (
            <ListItem key={i}>
              <Grid container>
                <Grid item xs={4} md={4}>
                  {entry.name}
                </Grid>
                <Grid item xs={4} md={4}>
                  {entry.monthlyAmount[state.monthIndex]}
                </Grid>
                <Grid item xs={2} md={2}>
                  <Checkbox />
                </Grid>
                <Grid item xs={2} md={2}>
                  <EditIcon
                    className={classes.icon}
                    onClick={() => handleModalOpen(entry)}
                  />
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </ul>
      </li>
    )
  }

  return (
    <Paper>
      <Modal open={modalState.isOpen} onClose={handleModalClose}>
        <EntryForm
          entry={modalState.entry}
          isEditing={modalState.isOpen}
          handleModalClose={handleModalClose}
        />
      </Modal>
      <div className={classes.header}>
        <Button
          color="secondary"
          onClick={() => dispatch(prevMonthAction(entries))}
        >
          Prev Month
        </Button>
        <Typography align="center">{getMonthAndYearString()}</Typography>
        <Button
          color="primary"
          onClick={() => dispatch(nextMonthAction(entries))}
        >
          Next Month
        </Button>
      </div>
      <List className={classes.listSection} subheader={<li />}>
        {renderListOfEntriesPerType(EInputType.Income)}
        {renderListOfEntriesPerType(EInputType.Expense)}
      </List>
    </Paper>
  )
}

export default MonthView
