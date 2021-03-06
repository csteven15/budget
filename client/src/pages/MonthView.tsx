import React, { FC, useEffect, useReducer, useState } from 'react'
import {
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
  Fab,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import { EInputType, MonthArray } from '../common/enums'
import { useEntry } from '../context/EntryContext'
import {
  calculatedDataStoreReducer,
  ICalcualtedMonth,
  ICalculatedMonthState,
  prevMonthAction,
  nextMonthAction,
  setYearAction,
  updateEntriesAction,
  setMonthAction,
} from '../store/CalculatedMonthDataStore'
import { IAccount, IEntry } from '../common/types'
import EntryForm from '../components/forms/Entry'
import { useAccount } from '../context/AccountContext'

const date = new Date()

const INITIAL_CALCULATED_MONTH: ICalcualtedMonth[] = MonthArray.map(
  (month, i) => ({
    monthIndex: i,
    year: date.getFullYear(),
    monthlyIncome: [],
    monthlyExpense: [],
    incomeTotal: 0,
    expenseTotal: 0,
    endOfMonthTotal: 0,
    balance: 0,
  })
)

const INITIAL_STATE: ICalculatedMonthState = {
  calculatedMonthData: INITIAL_CALCULATED_MONTH,
  totalAccountAppliedToBudget: 0,
  month: date.getMonth(),
  year: date.getFullYear(),
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '0 0 100%',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    listSection: {
      position: 'relative',
      overflow: 'auto',
      maxHeight: '70vh',
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
    modal: {
      position: 'absolute',
      padding: theme.spacing(2, 4, 3),
    },
    add: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 2,
    },
  })
)

interface IModalState {
  isOpen: boolean
  isEditing: boolean
  entry?: IEntry
}

const defaultModalState: IModalState = {
  isOpen: false,
  isEditing: false,
  entry: undefined,
}

interface IProps {
  renderHeaders: boolean
  propEntries?: IEntry[]
  propAccounts?: IAccount[]
  month?: number
}

const MonthView: FC<IProps> = ({
  renderHeaders,
  propEntries,
  propAccounts,
  month,
}) => {
  const [state, dispatch] = useReducer(
    calculatedDataStoreReducer,
    INITIAL_STATE
  )
  const [modalState, openModal] = useState<IModalState>(defaultModalState)

  const entries = renderHeaders ? useEntry().entries : propEntries
  const accounts = renderHeaders ? useAccount().accounts : propAccounts

  const classes = useStyles()

  const handleModalOpen = (entry?: IEntry) => {
    const isEditing = entry === undefined ? false : true
    openModal({ isOpen: true, isEditing: isEditing, entry: entry })
  }

  const handleModalClose = () => {
    openModal({ isOpen: false, isEditing: false, entry: undefined })
  }

  // on startup
  useEffect(() => {
    dispatch(setYearAction(date.getFullYear()))
    if (month !== undefined) {
      dispatch(setMonthAction(month))
    }
  }, [])

  useEffect(() => {
    dispatch(updateEntriesAction(entries!, accounts!))
  }, [entries, accounts, state.year])

  const getMonthAndYearString = () =>
    MonthArray[state.month] + ' ' + state.year.toString()

  const renderListOfEntriesPerType = (inputType: EInputType) => {
    const entriesToRender =
      inputType === EInputType.Income
        ? state.calculatedMonthData[state.month].monthlyIncome
        : state.calculatedMonthData[state.month].monthlyExpense

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
                  {entry.monthlyAmount[state.month]}
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
    <div className={classes.root}>
      <Modal
        className={classes.modal}
        open={modalState.isOpen}
        onClose={handleModalClose}
      >
        <EntryForm
          entry={modalState.entry}
          isEditing={modalState.isEditing}
          handleModalClose={handleModalClose}
        />
      </Modal>
      {renderHeaders ? (
        <div className={classes.header}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => dispatch(prevMonthAction())}
          >
            Prev Month
          </Button>
          <Typography align="center">{getMonthAndYearString()}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(nextMonthAction())}
          >
            Next Month
          </Button>
        </div>
      ) : null}

      <List className={classes.listSection} subheader={<li />}>
        {renderListOfEntriesPerType(EInputType.Income)}
        {renderListOfEntriesPerType(EInputType.Expense)}
      </List>
      <div className={classes.add}>
        <Fab color="primary" aria-label="add">
          <AddIcon onClick={() => handleModalOpen()} />
        </Fab>
      </div>
    </div>
  )
}

export default MonthView
