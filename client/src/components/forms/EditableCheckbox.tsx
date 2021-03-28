import React, { FC, useState } from 'react'
import { Checkbox } from '@chakra-ui/react'
import { RegisterOptions, useForm } from 'react-hook-form'
import { DocumentNode, gql, useMutation } from '@apollo/client'

interface IEditableCheckbox {
  id: string
  refName: string
  defaultValue: boolean
  mutationSchema: DocumentNode
}

const EditableCheckbox: FC<IEditableCheckbox> = ({
  id,
  refName,
  defaultValue,
  mutationSchema,
}) => {
  const [checked, setChecked] = useState(defaultValue)

  const [mutation] = useMutation<FormData>(mutationSchema)

  console.log(defaultValue)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
    mutation({
      variables: {
        payload: {
          _id: id,
          ...data,
        },
      },
    })
  }

  return (
    <Checkbox
      name="appliedToBudget"
      defaultValue={defaultValue === true ? 1 : 0}
      defaultChecked={defaultValue}
      onChange={(event) => {
        const data = {
          appliedToBudget: event.target.checked,
        }
        onSubmit(data)
      }}
    />
  )
}

export default EditableCheckbox
