import React, { FC, useState } from 'react'
import {
  useToast,
  theme,
  IconButton,
  Input,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react'
import { Controller, RegisterOptions, useForm } from 'react-hook-form'
import { CloseIcon, CheckIcon } from '@chakra-ui/icons'
import { gql, useMutation } from '@apollo/client'

const UPDATE_ENTRY_MUTATION = gql`
  mutation updateEntry($payload: UpdateEntryInput!) {
    updateEntry(payload: $payload) {
      _id
    }
  }
`

interface IEditableTextField {
  id: string
  refName: string
  defaultValue: number | string
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >
}

const EditableTextField: FC<IEditableTextField> = ({
  id,
  refName,
  defaultValue,
  rules,
}) => {
  const { errors, handleSubmit, control, reset } = useForm()

  const [updateEntry] = useMutation<FormData>(UPDATE_ENTRY_MUTATION)

  const [hover, setHover] = useState(false)

  const [trackedValue, setTrackedValue] = useState(defaultValue)

  const errorToast = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setTrackedValue(data[refName])
    updateEntry({
      variables: {
        payload: {
          _id: id,
          ...data,
        },
      },
    })
    reset({ ...data })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    errorToast({
      description: errors[refName].message,
      status: 'error',
      duration: 3e3,
      isClosable: true,
    })
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
