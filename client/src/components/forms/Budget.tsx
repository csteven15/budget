import React from 'react'
import { useForm } from "react-hook-form";
import { Button, TextField } from "@material-ui/core";

import { Budget as IBudget} from "../../../../common/types/budget";

export default function Budget() {
  const { register, handleSubmit } = useForm<IBudget>();

  const onSubmit = (data : IBudget) => {
    console.log(data);
  }

  return (
    <div>
      <form>
        <TextField id="standard-basic" name="budgetName" label="Budget Name" inputRef={register} />
        <TextField id="standard-basic" name="year" label="Year" inputRef={register} />
        <Button onClick={handleSubmit(onSubmit)} type="submit">Add</Button>
      </form>
    </div>
  )
}
