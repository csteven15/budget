import { FC } from 'react'
import { Checkbox } from '@chakra-ui/react'

import { useGenericMutation } from '../../hooks/useGenericMutation'

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
  const { mutate } = useGenericMutation(mutationSchema)

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
