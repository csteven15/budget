import React, { FC } from 'react'
import { Checkbox } from '@chakra-ui/react'
import { DocumentNode, useMutation } from '@apollo/client'

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
  const [mutation] = useMutation<FormData>(mutationSchema)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
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
      name={refName}
      defaultValue={defaultValue === true ? 1 : 0}
      defaultChecked={defaultValue}
      onChange={(event) => {
        const data = {
          [refName]: event.target.checked,
        }
        onSubmit(data)
      }}
    />
  )
}

export default EditableCheckbox
