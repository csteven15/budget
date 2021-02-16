import React, { FC, useState } from 'react'
import {
  Paper,
  Modal,
  Typography,
  createStyles,
  makeStyles,
  Button,
  Theme,
  Grid,
  List,
  ListSubheader,
  ListItem,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { useEntry } from '../context/EntryContext'
import { EInputType, MonthArray } from '../common/enums'
import { IEntry } from '../common/types'
import EntryForm from '../components/forms/Entry'
import { useAccount } from '../context/AccountContext'

interface IModalState {
  isOpen: boolean
  entry: IEntry | undefined
}

const defaultModalState: IModalState = {
  isOpen: false,
  entry: undefined,
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

interface MonthData {
  monthIndex: number
  incomeList: IEntry[]
  expenseList: IEntry[]
  incomeTotal: number
  expenseTotal: number
  balance: number
  endOfMonthTotal: number
}

const defaultMonthData: MonthData = {
  monthIndex: 0,
  incomeList: [],
  expenseList: [],
  incomeTotal: 0,
  expenseTotal: 0,
  balance: 0,
  endOfMonthTotal: 0,
}

const YearView: FC = () => {
  const { entries } = useEntry()
  const { accounts } = useAccount()
  const classes = useStyles()

  const [modalState, openModal] = useState<IModalState>(defaultModalState)

  const date = new Date()

  const handleModalOpen = (entry: IEntry) => {
    openModal({ isOpen: true, entry: entry })
  }

  const handleModalClose = () => {
    openModal({ isOpen: false, entry: undefined })
  }

  const getTotalAppliedToBudget = () => {
    let total = 0
    const accountsApplied = accounts.filter(
      (account) => account.isAppliedToBudget === true
    )
    accountsApplied.forEach((account) => {
      total += account.total
    })
    return total
  }

  const balanceList = Array<number>(12)

  const getBalanceUpToMonth = (monthIndex: number) => {
    let total = 0
    for (let i = 0; i < monthIndex; i++) {
      total += balanceList[i]
    }
    console.log(total)
    return total
  }

  const getMonthData = (monthIndex: number) => {
    const data: MonthData = defaultMonthData
    // sort by InputType
    const sortedByInputTypeArray = entries.sort(
      (a, b) => a.inputType - b.inputType
    )
    data.incomeList = sortedByInputTypeArray
      .filter((entry) => entry.inputType === EInputType.Income)
      .sort((a, b) => a.name.localeCompare(b.name))
    data.expenseList = sortedByInputTypeArray
      .filter((entry) => entry.inputType === EInputType.Expense)
      .sort((a, b) => a.name.localeCompare(b.name))

    data.incomeTotal = data.incomeList.reduce(
      (accumulator, { monthlyAmount }) =>
        accumulator + monthlyAmount[monthIndex],
      0
    )
    data.expenseTotal = data.expenseList.reduce(
      (accumulator, { monthlyAmount }) =>
        accumulator + monthlyAmount[monthIndex],
      0
    )

    data.balance = data.incomeTotal - data.expenseTotal
    data.endOfMonthTotal =
      getTotalAppliedToBudget() + getBalanceUpToMonth(monthIndex)
    data.monthIndex = monthIndex
    return data
  }

  const renderMonthListPerType = (
    inputType: EInputType,
    entriesToRender: IEntry[],
    monthIndex: number
  ) => {
    return (
      <List className={classes.listSection} subheader={<li />}>
        <li>
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
                  {entry.monthlyAmount[monthIndex]}
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
        </li>
      </List>
    )
  }

  const renderRow = (month: string, data: MonthData) => {
    const [openMonthList, setOpenMonthList] = useState(false)
    return (
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary>
          <Grid container onClick={() => setOpenMonthList(!openMonthList)}>
            <Grid item xs={4} md={4}>
              {month}
            </Grid>
            <Grid item xs={2} md={2}>
              {data.incomeTotal}
            </Grid>
            <Grid item xs={2} md={2}>
              {data.expenseTotal}
            </Grid>
            <Grid item xs={2} md={2}>
              {data.balance}
            </Grid>
            <Grid item xs={2} md={2}>
              {data.endOfMonthTotal}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            {renderMonthListPerType(
              EInputType.Income,
              data.incomeList,
              data.monthIndex
            )}
            {renderMonthListPerType(
              EInputType.Expense,
              data.expenseList,
              data.monthIndex
            )}
          </Container>
        </AccordionDetails>
      </Accordion>
    )
  }

  const monthDataList = MonthArray.map((month, i) => {
    const data = getMonthData(i)
    balanceList[i] = data.balance
    return data
  })

  const renderMonthData = () => {
    return MonthArray.map((month, i) => {
      return renderRow(month, monthDataList[i])
    })
  }

  const renderYearViewData = () => {
    return (
      <List className={classes.listSection} subheader={<li />}>
        <li>
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
        </li>
      </List>
    )
  }

  return (
    <Paper>
      <div className={classes.header}>
        <Button color="secondary">Prev Year</Button>
        <Typography align="center">{date.getFullYear()}</Typography>
        <Button color="primary">Next Year</Button>
      </div>
      {renderYearViewData()}
      {/* // change state of modal from entry form */}
      <Modal open={modalState.isOpen} onClose={handleModalClose}>
        <EntryForm
          entry={modalState.entry}
          isEditing={modalState.isOpen}
          handleModalClose={handleModalClose}
        />
      </Modal>
    </Paper>
  )
}

export default YearView
