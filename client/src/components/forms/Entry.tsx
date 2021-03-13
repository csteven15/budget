import React, { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'

import { IEntry } from '../../common/types'
import ReactHookFormSelect from './ReactHookFormSelect'
import { useAuth } from '../../context/AuthContext'
import SimpleSnackbar from '../SnackBar'
import { EFrequencyType, EFrequencyValues } from '../../common/enums/index'
import { useQuery, gql, useMutation } from '@apollo/client'

interface CreateEntryInput {
  userId: string
  name: string
  type: number
  budgetedAmount: number
  // createdAt will be auto populated
  startDate?: Date
  endDate?: Date

  // for the form
  frequency?: number
}

interface FormData {
  payload: CreateEntryInput
}

const CREATE_ENTRY_MUTATION = gql`
  mutation createEntry($payload: CreateEntryInput!) {
    createEntry(payload: $payload) {
      _id
      userId
    }
  }
`

const inputType = [
  { value: 0, text: 'Income' },
  { value: 1, text: 'Expense' },
]

interface IProps {
  entry?: IEntry
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

const EntrySchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name for entry cannot be empty',
  }),
  type: Joi.number().required(),
  budgetedAmount: Joi.number().required(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  frequency: Joi.number().required(),
})

const EntryForm: FC<IProps> = ({ entry, isEditing, handleModalClose }) => {
  const { register, watch, control, errors, handleSubmit } = useForm<IEntry>({
    resolver: joiResolver(EntrySchema),
  })

  const [addEntry, { data }] = useMutation<FormData>(CREATE_ENTRY_MUTATION)

  const classes = useStyles()
  const { user } = useAuth()

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)

  const today = new Date()
  const yearFromToday = new Date().setFullYear(today.getFullYear() + 1)
  const selectedFrequency = watch('frequency')
  let isRecurring = false
  if (EFrequencyType.Once !== selectedFrequency) {
    isRecurring = true
  }
  const onSubmit = async (formData: IEntry) => {
    console.log(formData)
    try {
      if (isEditing) {
        //updateEntry(inputEntry)
        if (handleModalClose) {
          handleModalClose()
        }
      } else {
        const inputEntry: CreateEntryInput = {
          userId: user.uid as string,
          name: formData.name,
          type: formData.type,
          budgetedAmount: formData.budgetedAmount,
        }
        addEntry({
          variables: {
            payload: inputEntry,
          },
        })
      }
      setFormSubmitted(true)
      // reset after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false)
      }, 5000)
    } catch (error) {
      setFormError(true)
      // reset after 5 seconds
      setTimeout(() => {
        setFormError(false)
      }, 5000)
    }
  }

  const onDelete = () => {
    //deleteEntry(entry?._id as string)
    if (handleModalClose) {
      handleModalClose()
    }
  }

  return (
    <Paper className={classes.paper}>
      <Typography align="center">
        {isEditing ? 'Entry Update' : 'Add an Entry'}
      </Typography>
      <br />
      <SimpleSnackbar isOpen={formSubmitted} message={'Form Submitted'} />
      <SimpleSnackbar isOpen={formError} message={'Error'} />
      <form autoComplete="off">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              id="standard-basic"
              label="Name"
              name="name"
              defaultValue={entry?.name}
              inputRef={register()}
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactHookFormSelect
              name="type"
              label="Choose type of input"
              defaultValue={
                isEditing ? (entry?.type as number) : inputType[0].value
              }
              control={control}
            >
              {inputType.map((input) => (
                <MenuItem key={input.value} value={input.value}>
                  {input.text}
                </MenuItem>
              ))}
            </ReactHookFormSelect>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Budget Amount"
              name="budgetedAmount"
              defaultValue={entry?.budgetedAmount}
              inputRef={register}
              error={!!errors.budgetedAmount?.message}
              helperText={errors.budgetedAmount?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactHookFormSelect
              name="frequency"
              label="Choose Frequency"
              defaultValue={EFrequencyType.Once}
              control={control}
            >
              {EFrequencyValues.map((frequency) => (
                <MenuItem key={frequency.value} value={frequency.value}>
                  {frequency.text}
                </MenuItem>
              ))}
            </ReactHookFormSelect>
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={isRecurring ? 6 : 12}>
              <Controller
                control={control}
                name="startDate"
                defaultValue={today}
                render={({ ...rest }) => (
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    label={isRecurring ? 'Choose Start Date' : 'Choose Date'}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    error={!!errors.startDate?.message}
                    helperText={errors.startDate?.message}
                    {...rest}
                  />
                )}
              />
            </Grid>
            {isRecurring === true ? (
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="endDate"
                  defaultValue={new Date(yearFromToday)}
                  render={({ ...rest }) => (
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      label="Choose End Date"
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      error={!!errors.endDate?.message}
                      helperText={errors.endDate?.message}
                      {...rest}
                    />
                  )}
                />
              </Grid>
            ) : null}
          </Grid>
        </MuiPickersUtilsProvider>
        <br />
        <Grid container>
          <Grid item md={6}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              {isEditing ? 'Update Entry' : 'Add Entry'}
            </Button>
          </Grid>
          {isEditing ? (
            <Grid item md={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete()}
              >
                Delete Entry
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </form>
    </Paper>
  )
}

export default EntryForm
