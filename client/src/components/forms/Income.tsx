import React from 'react'
import { Income as IncomeType } from '../../common/types/income'
import { useForm } from "react-hook-form"
import { Button, TextField } from "@material-ui/core"

export default function Income() {

  const { register, handleSubmit } = useForm<IncomeType>()

  const onSubmit = (data: IncomeType) => {
    console.log(data)
  }

  return (
    <div>
      <form>
        <TextField id="standard-basic" name="name" inputRef={register} />
        <TextField id="standard-basic" name="amount" inputRef={register} />
        <TextField id="standard-basic" name="frequency" inputRef={register} />
        <Button onClick={handleSubmit(onSubmit)} type="submit">Add</Button>
      </form>
    </div>
  )
}
