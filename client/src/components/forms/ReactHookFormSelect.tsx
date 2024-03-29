import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import { FC } from 'react'
import { Control, Controller } from 'react-hook-form'

interface IProps {
  name: string
  label: string
  control: Control
  defaultValue: number
}

const ReactHookFormSelect: FC<IProps> = ({
  name,
  label,
  control,
  defaultValue,
  children,
  ...props
}) => {
  const labelId = `${name}`
  return (
    <FormControl {...props} fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        as={
          <Select labelId={labelId} label={label}>
            {children}
          </Select>
        }
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
    </FormControl>
  )
}
export default ReactHookFormSelect
