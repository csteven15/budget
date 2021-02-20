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

import { useEntry } from '../../context/EntryContext'
import { IEntry } from '../../common/types'
import ReactHookFormSelect from './ReactHookFormSelect'
import { useAuth } from '../../context/AuthContext'
import SimpleSnackbar from '../SnackBar'
import { MonthArray } from '../../common/enums'

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
  year: Joi.number().positive().required().messages({
    'number.positive': 'Year for entry must be positive',
  }),
  inputType: Joi.number().required(),
  maxAmount: Joi.number().required(),
  isFixed: Joi.boolean().required(),
  amount: Joi.number().positive().max(Joi.ref('maxAmount')).messages({
    'number.required': 'amount is required',
    'number.max': '"amount" should be less than max amount',
  }),
  January: Joi.number().positive().max(Joi.ref('maxAmount')),
  February: Joi.number().positive().max(Joi.ref('maxAmount')),
  March: Joi.number().positive().max(Joi.ref('maxAmount')),
  April: Joi.number().positive().max(Joi.ref('maxAmount')),
  May: Joi.number().positive().max(Joi.ref('maxAmount')),
  June: Joi.number().positive().max(Joi.ref('maxAmount')),
  July: Joi.number().positive().max(Joi.ref('maxAmount')),
  August: Joi.number().positive().max(Joi.ref('maxAmount')),
  September: Joi.number().positive().max(Joi.ref('maxAmount')),
  October: Joi.number().positive().max(Joi.ref('maxAmount')),
  November: Joi.number().positive().max(Joi.ref('maxAmount')),
  December: Joi.number().positive().max(Joi.ref('maxAmount')),
})

const EntryForm: FC<IProps> = ({ entry, isEditing, handleModalClose }) => {
  const {
    register,
    watch,
    control,
    getValues,
    errors,
    handleSubmit,
  } = useForm<IEntry>({
    resolver: joiResolver(EntrySchema),
  })

  const classes = useStyles()
  const { user } = useAuth()
  const { addEntry, deleteEntry, updateEntry } = useEntry()

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  let watchIsFixed = watch('isFixed', true)

  let isFixed = false

  if (isEditing) {
    isFixed = entry!.monthlyAmount!.every(
      (amount) => amount === entry?.monthlyAmount![0]
    )!
    if (!isFixed) {
      watchIsFixed = false
    }
  }

  const onSubmit = async (formData: IEntry) => {
    console.log(formData)
    let transformedMonthlyAmount: number[] = new Array<number>(12)
    if (formData.isFixed) {
      transformedMonthlyAmount.fill(formData!.amount!)
    } else {
      // each monthly value is stored in an object with the name key due to react-form-hooks api
      transformedMonthlyAmount = MonthArray.map(
        (month: string) => formData[month as keyof IEntry] as number
      )
    }
    const inputEntry: IEntry = {
      _id: isEditing ? entry?._id : undefined,
      uid: user.uid as string,
      name: formData.name,
      year: formData.year,
      inputType: formData.inputType,
      monthlyAmount: transformedMonthlyAmount,
      maxAmount: formData.maxAmount,
    }
    try {
      if (isEditing) {
        updateEntry(inputEntry)
        if (handleModalClose) {
          handleModalClose()
        }
      } else {
        addEntry(inputEntry)
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
    deleteEntry(entry?._id as string)
    if (handleModalClose) {
      handleModalClose()
    }
  }

  return (
    <Paper className={classes.paper}>
      <Typography align="center">Add an Budget Entry</Typography>
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
              defaultValue={isEditing && entry?.name}
              inputRef={register()}
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="standard-basic"
              label="Year"
              name="year"
              defaultValue={isEditing && entry?.year}
              inputRef={register()}
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactHookFormSelect
              name="inputType"
              label="Choose type of input"
              defaultValue={
                isEditing ? (entry?.inputType as number) : inputType[0].value
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
              label="Max Amount"
              name="maxAmount"
              defaultValue={isEditing && entry?.maxAmount}
              inputRef={register}
              error={!!errors.maxAmount?.message}
              helperText={errors.maxAmount?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              name="isFixed"
              label="Fixed Amount"
              control={
                <Checkbox
                  defaultChecked={isEditing ? (isFixed ? true : false) : true}
                />
              }
              inputRef={register}
            />
          </Grid>
          {watchIsFixed === true ? (
            <Grid item xs={12} md={6}>
              <TextField
                label="Amount"
                name="amount"
                defaultValue={isEditing && entry?.monthlyAmount![0]}
                inputRef={register}
                error={!!errors?.amount?.message}
                helperText={errors?.amount?.message}
                fullWidth
              />
            </Grid>
          ) : null}
          {watchIsFixed === false
            ? MonthArray.map((month, i) => (
                <Grid key={month} item xs={12} md={6}>
                  <TextField
                    label={`${MonthArray[i]} Amount`}
                    name={`${MonthArray[i]}`}
                    inputRef={register}
                    defaultValue={
                      isEditing
                        ? entry!.monthlyAmount![i]
                        : getValues('maxAmount')
                    }
                    // @ts-ignore
                    error={!!errors[month]?.message}
                    // @ts-ignore
                    helperText={errors[month]?.message}
                    fullWidth
                  />
                </Grid>
              ))
            : null}
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
