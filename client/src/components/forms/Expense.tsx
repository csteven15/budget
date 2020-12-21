import React from 'react'
import { Expense as ExpenseType } from '../../common/types/expense'
import { useForm } from "react-hook-form"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
)

export default function Expense() {
  const classes = useStyles()

  const { register, handleSubmit } = useForm<ExpenseType>()

  const onSubmit = (data: ExpenseType) => {
    console.log(data)
  }

  return (
    <div>
      <form className={classes.root}>
        <TextField id="standard-basic" name="name" label="Name" inputRef={register} />
        <TextField id="standard-basic" name="frequency" label="Frequency" inputRef={register} />
        <TextField id="standard-basic" name="amount" label="Amount" inputRef={register} />
        <TextField id="standard-basic" name="isFixedAmount" label="Is Fixed Amount" inputRef={register} />
        <TextField id="standard-basic" name="maxAmount" label="Max Amount" inputRef={register} />
        <Button onClick={handleSubmit(onSubmit)} type="submit">Add</Button>
      </form>
    </div>
  )
}
