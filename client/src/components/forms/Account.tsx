import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'

import { useAccount } from '../../context/AccountContext'
import { IAccount } from '../../common/types'
import ReactHookFormSelect from './ReactHookFormSelect'
import { useAuth } from '../../context/AuthContext'
import SimpleSnackbar from '../SnackBar'
import { EAccountType, AccountTypeArray } from '../../common/enums'

interface IProps {
  account?: IAccount
  isEditing?: boolean
  handleModalClose?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      margin: '0 auto',
      padding: '1em',
      backgroundColor: theme.palette.background.paper,
    },
  })
)

const AccountSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name for account cannot be empty',
  }),
  type: Joi.number().required(),
  total: Joi.number().positive().required().messages({
    'number.positive': 'Total for account must be positive',
  }),
  isAppliedToBudget: Joi.boolean().required(),
})

const AccountForm: FC<IProps> = ({ account, isEditing, handleModalClose }) => {
  const { register, control, errors, handleSubmit } = useForm<IAccount>({
    resolver: joiResolver(AccountSchema),
  })

  const classes = useStyles()
  const { user } = useAuth()
  const { addAccount, deleteAccount, updateAccount } = useAccount()

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)

  const onSubmit = async (formData: IAccount) => {
    console.log(formData)

    const input: IAccount = {
      _id: isEditing ? account?._id : undefined,
      uid: user.uid as string,
      name: formData.name,
      type: formData.type,
      total: formData.total,
      isAppliedToBudget: formData.isAppliedToBudget,
    }

    try {
      if (isEditing) {
        updateAccount(input)
        if (handleModalClose) {
          handleModalClose()
        }
      } else {
        addAccount(input)
      }
      setFormSubmitted(true)
      // reset after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false)
      }, 5000)
    } catch (error) {
      console.log(error)
      setFormError(true)
      // reset after 5 seconds
      setTimeout(() => {
        setFormError(false)
      }, 5000)
    }
  }

  const onDelete = () => {
    deleteAccount(account?._id as string)
    if (handleModalClose) {
      handleModalClose()
    }
  }

  return (
    <Paper className={classes.paper}>
      <Typography align="center">Add an Account</Typography>
      <br />
      <SimpleSnackbar isOpen={formSubmitted} message={'Form Submitted'} />
      <SimpleSnackbar isOpen={formError} message={'Error'} />
      <form autoComplete="off">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              id="standard-basic"
              label="Account Name"
              name="name"
              defaultValue={isEditing && account?.name}
              inputRef={register()}
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactHookFormSelect
              name="type"
              label="Choose type of account"
              defaultValue={
                isEditing ? (account?.type as number) : EAccountType.Checking
              }
              control={control}
            >
              {AccountTypeArray.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.text}
                </MenuItem>
              ))}
            </ReactHookFormSelect>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Total in Account"
              name="total"
              defaultValue={isEditing && account?.total}
              inputRef={register()}
              error={!!errors.total?.message}
              helperText={errors.total?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              name="isAppliedToBudget"
              label="Apply to Budget"
              control={
                <Checkbox
                  defaultChecked={
                    isEditing
                      ? account?.isAppliedToBudget
                        ? true
                        : false
                      : true
                  }
                />
              }
              inputRef={register()}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container>
          <Grid item md={6}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              {isEditing ? 'Update Account' : 'Add Account'}
            </Button>
          </Grid>
          {isEditing ? (
            <Grid item md={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete()}
              >
                Delete Account
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </form>
    </Paper>
  )
}

export default AccountForm
