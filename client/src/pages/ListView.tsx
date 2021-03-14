import React, { FC, useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  Grid,
  List,
  ListItem,
  createStyles,
  makeStyles,
  Theme,
  ListSubheader,
  Checkbox,
  Fab,
  Modal,
  Collapse,
  IconButton,
} from '@material-ui/core'
import { format } from 'date-fns'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { EInputType } from '../common/enums/index'
import EntryForm from '../components/forms/Entry'
import { IAmount, IEntry } from '../common/types'

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

const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput) {
    entries(filter: $filter, payload: $payload) {
      name
      _id
      type
      budgetedAmount
      amounts {
        date
        amount
        paid
      }
    }
  }
`

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

const date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth()

const createQueryForType = (type: EInputType) => {
  return {
    variables: {
      filter: {
        startDate: new Date(y, m, 1),
        endDate: new Date(y, m + 1, 0),
      },
      payload: {
        type: type,
      },
    },
  }
}

const ListView: FC = () => {
  const classes = useStyles()
  const [modalState, openModal] = useState<IModalState>(defaultModalState)
  const incomeQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Income)
  )
  const ExpenseQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Expense)
  )

  const handleModalOpen = (entry?: IEntry) => {
    const isEditing = entry === undefined ? false : true
    openModal({ isOpen: true, isEditing: isEditing, entry: entry })
  }
  const handleModalClose = () => {
    openModal({ isOpen: false, isEditing: false, entry: undefined })
    incomeQuery.refetch()
    ExpenseQuery.refetch()
  }

  const renderListOfEntriesByType = (entries: IEntry[]) => {
    return (
      <List className={classes.listSection} subheader={<li />}>
        <li className={classes.li}>
          <ul className={classes.ul}>
            <ListSubheader>
              <Grid container>
                <Grid item xs={1} md={1} />
                <Grid item xs={5} md={5}>
                  {entries === undefined
                    ? null
                    : entries[0]?.type === 1
                    ? 'Expense'
                    : 'Income'}
                </Grid>
                <Grid item xs={5} md={5}>
                  Budgeted Amount
                </Grid>
                <Grid item xs={1} md={1}>
                  Edit
                </Grid>
              </Grid>
            </ListSubheader>
            {entries?.map((entry: IEntry, i: number) => {
              return <CollapsibleRow key={i} entry={entry} />
            })}
          </ul>
        </li>
      </List>
    )
  }

  return (
    <div className={classes.root}>
      <Modal
        className={classes.modal}
        open={modalState.isOpen}
        onClose={handleModalClose}
      >
        <EntryForm handleModalClose={handleModalClose} />
      </Modal>
      {renderListOfEntriesByType(incomeQuery.data?.entries)}
      {renderListOfEntriesByType(ExpenseQuery.data?.entries)}
      <div className={classes.add}>
        <Fab color="primary" aria-label="add">
          <AddIcon onClick={() => handleModalOpen()} />
        </Fab>
      </div>
    </div>
  )
}

interface CollapsibleRowProps {
  entry: IEntry
}

export const CollapsibleRow: FC<CollapsibleRowProps> = ({ entry }) => {
  const classes = useStyles()
  const [openCollapse, setOpenCollapse] = useState(false)
  const [modalState, openModal] = useState<IModalState>(defaultModalState)
  const handleModalOpen = (entry?: IEntry) => {
    const isEditing = entry === undefined ? false : true
    openModal({ isOpen: true, isEditing: isEditing, entry: entry })
  }
  const handleModalClose = () => {
    openModal({ isOpen: false, isEditing: false, entry: undefined })
  }

  const renderListOfAmountsForEntry = (entry: IEntry) => {
    return (
      <List className={classes.listSection} subheader={<li />}>
        <li className={classes.li}>
          <ul className={classes.ul}>
            <ListSubheader>
              <Grid container>
                <Grid item xs={2} md={2} />
                <Grid item xs={3} md={3}>
                  Dates
                </Grid>
                <Grid item xs={3} md={3}>
                  Actual Amounts
                </Grid>
                <Grid item xs={2} md={2}>
                  Paid
                </Grid>
                <Grid item xs={1} md={1}>
                  Edit
                </Grid>
              </Grid>
            </ListSubheader>
            {entry?.amounts?.map((amount: IAmount, i: number) => {
              return (
                <ListItem key={i}>
                  <Grid container key={i}>
                    <Grid item xs={2} md={2} />
                    <Grid item xs={3} md={3}>
                      {amount.date === undefined
                        ? null
                        : format(new Date(amount.date), 'MM-dd-yyyy')}
                    </Grid>
                    <Grid item xs={3} md={3}>
                      {amount.amount}
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <Checkbox checked={amount.paid} />
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <EditIcon
                        className={classes.icon}
                        onClick={() => handleModalOpen(entry)}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              )
            })}
          </ul>
        </li>
      </List>
    )
  }

  return (
    <div>
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
      <ListItem>
        <Grid container>
          <Grid
            item
            xs={1}
            md={1}
            onClick={() => setOpenCollapse(!openCollapse)}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenCollapse(!open)}
            >
              {openCollapse ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={5} md={5}>
            {entry.name}
          </Grid>
          <Grid item xs={5} md={5}>
            {entry.budgetedAmount}
          </Grid>
          <Grid item xs={1} md={1}>
            <EditIcon
              className={classes.icon}
              onClick={() => handleModalOpen(entry)}
            />
          </Grid>
        </Grid>
      </ListItem>
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        {renderListOfAmountsForEntry(entry)}
      </Collapse>
    </div>
  )
}

export default ListView
