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
import { DocumentNode, useMutation } from '@apollo/client'

interface IEditableTextField {
  id: string
  refName: string
  defaultValue: number | string
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >
  mutationSchema: DocumentNode
}

const EditableTextField: FC<IEditableTextField> = ({
  id,
  refName,
  defaultValue,
  rules,
  mutationSchema,
}) => {
  const { errors, handleSubmit, control, reset } = useForm()

  const [mutation] = useMutation<FormData>(mutationSchema)

  const [hover, setHover] = useState(false)

  const [trackedValue, setTrackedValue] = useState(defaultValue)

  const errorToast = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setTrackedValue(data[refName])
    mutation({
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
