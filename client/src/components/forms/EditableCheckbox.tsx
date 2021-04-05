import React, { FC } from 'react'
import { Checkbox } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query'
import { Variables } from 'graphql-request/dist/types'
import { endpoint } from '../../util/Api'
import request from 'graphql-request'

interface IEditableCheckbox {
  id: string
  refName: string
  defaultValue: boolean
  mutationSchema: string
}

const EditableCheckbox: FC<IEditableCheckbox> = ({
  id,
  refName,
  defaultValue,
  mutationSchema,
}) => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation(
    (variables: Variables) => request(endpoint, mutationSchema, variables),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entries')
        queryClient.invalidateQueries('amounts')
        queryClient.invalidateQueries('accounts')
      },
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    mutate({
      payload: {
        _id: id,
        ...data,
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
