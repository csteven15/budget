import React, { FC, useState } from 'react'
import {
  Paper,
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
import { EAccountType } from '../common/enums'
import { IAccount } from '../common/types'
import AccountForm from '../components/forms/Account'

interface IModalState {
  isOpen: boolean
  isEditing: boolean
  account?: IAccount
}

const defaultModalState: IModalState = {
  isOpen: false,
  isEditing: false,
  account: undefined,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      justifyContent: 'space-evenly',
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
    modal: {
      position: 'absolute',
      padding: theme.spacing(2, 4, 3),
    },
    add: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
)

const AccountView: FC = () => {
  const [modalState, openModal] = useState<IModalState>(defaultModalState)
  const classes = useStyles()

  const handleModalOpen = (account?: IAccount) => {
    const isEditing = account === undefined ? false : true
    openModal({ isOpen: true, isEditing: isEditing, account: account })
  }

  const handleModalClose = () => {
    openModal({ isOpen: false, isEditing: false, account: undefined })
  }

  // const getTotalAppliedToBudget = () => {
  //   let total = 0
  //   const accountsApplied = accounts.filter(
  //     (account) => account.isAppliedToBudget === true
  //   )
  //   accountsApplied.forEach((account) => {
  //     total += account.total
  //   })
  //   return total
  // }

  const handleApplyToBudgetCheckBox = (
    account: IAccount,
    toggleChecked: boolean
  ) => {
    const input = account
    input.isAppliedToBudget = toggleChecked
    // updateAccount(input)
  }

  // const renderAccountsPerType = (type: EAccountType) => {
  //   const accountsToRender = accounts.filter((account) => account.type === type)
  //   return (
  //     <li className={classes.li}>
  //       <ul className={classes.ul}>
  //         <ListSubheader>
  //           <Grid container>
  //             <Grid item xs={4} md={4}>
  //               {EAccountType[type]}
  //             </Grid>
  //             <Grid item xs={4} md={4}>
  //               Total
  //             </Grid>
  //             <Grid item xs={2} md={2}>
  //               Applied
  //             </Grid>
  //             <Grid item xs={2} md={2}>
  //               Edit
  //             </Grid>
  //           </Grid>
  //         </ListSubheader>
  //         {accountsToRender.map((account, i) => (
  //           <ListItem key={i}>
  //             <Grid container>
  //               <Grid item xs={4} md={4}>
  //                 {account.name}
  //               </Grid>
  //               <Grid item xs={4} md={4}>
  //                 {account.total}
  //               </Grid>
  //               <Grid item xs={2} md={2}>
  //                 <Checkbox
  //                   checked={account.isAppliedToBudget ? true : false}
  //                   onClick={() =>
  //                     handleApplyToBudgetCheckBox(
  //                       account,
  //                       !account.isAppliedToBudget
  //                     )
  //                   }
  //                 />
  //               </Grid>
  //               <EditIcon
  //                 className={classes.icon}
  //                 onClick={() => handleModalOpen(account)}
  //               />
  //             </Grid>
  //           </ListItem>
  //         ))}
  //       </ul>
  //     </li>
  //   )
  // }

  return (
    <Paper>
      <Typography className={classes.header}>
        {/* {'Total Applied to Budget: ' + getTotalAppliedToBudget()} */}
      </Typography>
      <br />
      <Modal
        className={classes.modal}
        open={modalState.isOpen}
        onClose={handleModalClose}
      >
        <AccountForm
          account={modalState.account}
          isEditing={modalState.isEditing}
          handleModalClose={handleModalClose}
        />
      </Modal>
      <List className={classes.listSection} subheader={<li />}>
        {/* TODO: Make interative */}
        {/* {renderAccountsPerType(EAccountType.Checking)}
        {renderAccountsPerType(EAccountType.Savings)}
        {renderAccountsPerType(EAccountType.Investment)}
        {renderAccountsPerType(EAccountType.Retirement)} */}
      </List>
      <div className={classes.add}>
        <Fab color="primary" aria-label="add">
          <AddIcon onClick={() => handleModalOpen()} />
        </Fab>
      </div>
    </Paper>
  )
}

export default AccountView
