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
} from '@material-ui/core'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'

import Api from '../../util/Api'
import { useEntry } from '../../context/EntryContext'
import { IEntry } from '../../common/types'
import ReactHookFormSelect from './ReactHookFormSelect'
import { useAuth } from '../../context/AuthContext'
import SimpleSnackbar from '../SnackBar'
import { AxiosResponse } from 'axios'
import { MonthArray } from '../../common/enums'

const inputType = [
  { value: 0, text: 'Income' },
  { value: 1, text: 'Expense' },
]

interface IObjectKeys {
  [key: string]: string | number | undefined | boolean
}

interface IFormData extends IObjectKeys {
  _id?: string
  uid: string
  name: string
  year: number
  inputType: number
  maxAmount: number
  isFixed: boolean
  amount?: number
  January?: number
  February?: number
  March?: number
  April?: number
  May?: number
  June?: number
  July?: number
  August?: number
  September?: number
  October?: number
  November?: number
  December?: number
}

interface Props {
  entry?: IEntry
  isEditing?: boolean
}

const EntrySchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name for entry cannot be empty',
  }),
  year: Joi.number().positive().required().messages({
    // 'number.required': 'Year for entry is required',
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

const EntryForm: FC<Props> = ({ entry, isEditing }) => {
  const {
    register,
    watch,
    control,
    getValues,
    errors,
    setValue,
    handleSubmit,
  } = useForm<IFormData>({
    resolver: joiResolver(EntrySchema),
  })

  const { user } = useAuth()
  const { setEntry } = useEntry()

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  const watchIsFixed = watch('isFixed', true)

  if (isEditing) {
    setValue('name', entry?.name)
    setValue('year', entry?.year)
    setValue('inputType', entry?.inputType)
    setValue('maxAmount', entry?.maxAmount.toFixed(2))
    const isFixed = entry?.monthlyAmount.every(
      (amount) => amount === entry?.monthlyAmount[0]
    )
    if (isFixed) {
      setValue('amount', entry?.monthlyAmount[0])
    } else {
      setValue('isFixed', true)
      entry?.monthlyAmount.forEach((amount, i) => {
        setValue(`monthlyAmount[${i}].name`, amount)
      })
    }
  }

  const onSubmit = async (formData: IFormData) => {
    console.log(formData)
    const transformedMonthlyAmount = new Array<number>(12)
    if (formData.isFixed) {
      transformedMonthlyAmount.fill(formData?.amount as number)
    } else {
      MonthArray.map((month, i) => {
        transformedMonthlyAmount[i] = formData[month] as number
      })
      // each monthly value is stored in an object with the name key due to react-form-hooks api
      // transformedMonthlyAmount = MonthArray.map(month => formData[month as string]);
    }
    const inputEntry: IEntry = {
      uid: user.uid as string,
      name: formData.name,
      year: formData.year,
      inputType: formData.inputType,
      monthlyAmount: transformedMonthlyAmount,
      maxAmount: formData.maxAmount,
    }
    try {
      const res: AxiosResponse<IEntry> = await Api.post('/entry', inputEntry)
      const entry = res.data
      setFormSubmitted(true)
      // reset after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false)
      }, 5000)
      setEntry(entry)
    } catch (error) {
      setFormError(true)
      // reset after 5 seconds
      setTimeout(() => {
        setFormError(false)
      }, 5000)
    }
  }

  return (
    <Paper
      style={{
        width: '50%',
        margin: '0 auto',
        padding: '1em',
      }}
    >
      <SimpleSnackbar isOpen={formSubmitted} message={'Form Submitted'} />
      <SimpleSnackbar isOpen={formError} message={'Error'} />
      <form autoComplete="off">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              id="standard-basic"
              label="Name"
              name="name"
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
              defaultValue={inputType[0].value}
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
              inputRef={register}
              error={!!errors.maxAmount?.message}
              helperText={errors.maxAmount?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox defaultChecked={true} />}
              inputRef={register}
              name="isFixed"
              label="Fixed Amount"
            />
          </Grid>
          {watchIsFixed === true ? (
            <Grid item xs={12} md={6}>
              <TextField
                label="Amount"
                name="amount"
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
                    defaultValue={getValues('maxAmount')}
                    error={!!errors[month]?.message}
                    helperText={errors[month]?.message}
                    fullWidth
                  />
                </Grid>
              ))
            : null}
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default EntryForm
