import { FC } from 'react'
import { Checkbox } from '@chakra-ui/react'
import { useMutation } from 'react-query'

interface IEditableCheckbox {
  id: string
  refName: string
  defaultValue: boolean
  mutationSchema: string
}

const EditableCheckbox: FC<IEditableCheckbox> = ({
  refName,
  defaultValue,
  mutationSchema,
}) => {
  const { mutate } = useMutation(mutationSchema)

  // eslint-disable-next-line
  const onSubmit = (data: any) => {
    mutate()
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
