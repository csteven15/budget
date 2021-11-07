import { FC, useState } from 'react'
import {
  useToast,
  theme,
  IconButton,
  Input,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react'
import { CloseIcon, CheckIcon } from '@chakra-ui/icons'
import { Controller, RegisterOptions, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

interface IEditableTextField {
  id: string
  refName: string
  defaultValue: number | string
  mutationSchema: string
  type: 'string' | 'number' | 'float'
  required?: boolean
}

const EditableTextField: FC<IEditableTextField> = ({
  refName,
  defaultValue,
  mutationSchema,
  type,
  required,
}) => {
  const { errors, handleSubmit, control, reset } = useForm()

  const { mutate } = useMutation(mutationSchema)

  const [hover, setHover] = useState(false)

  const [trackedValue, setTrackedValue] = useState(defaultValue)

  const errorToast = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (type === 'number') data[refName] = parseInt(data[refName])
    if (type === 'float') data[refName] = parseFloat(data[refName])
    setTrackedValue(data[refName])
    mutate()

    reset({ ...data })
  }

  // eslint-disable-next-line
  const onError = (errors: any) => {
    errorToast({
      // description: errors[refName].message,
      status: 'error',
      duration: 3e3,
      isClosable: true,
    })
  }

  const rules: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  > = {}

  if (type === 'number' || type === 'float') {
    rules.min = {
      value: 0,
      message: 'No negative value',
    }
    rules.pattern = {
      value: /^\d+\.?\d*$/,
      message: 'Wrong format: E.g. 100.00',
    }
  }

  if (required) {
    rules.required = { value: true, message: 'Required' }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Controller
        control={control}
        name={refName}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, onBlur, value, ref }) => (
          <Flex>
            <Box>
              {hover || value !== trackedValue ? (
                <Input
                  variant="outline"
                  my={-2}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  inputref={ref}
                  isInvalid={errors[refName]}
                  errorBorderColor={theme.colors.red[300]}
                />
              ) : (
                <Text>{value}</Text>
              )}
            </Box>
            {value !== trackedValue ? (
              <>
                <Box>
                  <IconButton
                    my={-3}
                    aria-label="reset"
                    icon={<CloseIcon />}
                    onClick={() => {
                      setHover(false)
                      onChange(defaultValue)
                    }}
                  />
                </Box>
                <Box>
                  <IconButton
                    my={-3}
                    aria-label="check"
                    type="submit"
                    icon={<CheckIcon />}
                    onClick={() => {
                      if (!!errors[refName]) {
                        setHover(false)
                      }
                    }}
                  />
                </Box>
              </>
            ) : null}
          </Flex>
        )}
      />
    </form>
  )
}

export default EditableTextField
