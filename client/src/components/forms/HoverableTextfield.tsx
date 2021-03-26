import React, { FC, useState } from 'react'
import { useToast, theme, IconButton, Input, Text } from '@chakra-ui/react'
import { Controller, RegisterOptions, useForm } from 'react-hook-form'
import { CloseIcon, CheckIcon } from '@chakra-ui/icons'

interface IHoverableTextField {
  refName: string
  defaultValue: number | string
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >
}

const HoverableTextField: FC<IHoverableTextField> = ({
  refName,
  defaultValue,
  rules,
}) => {
  const { errors, handleSubmit, control } = useForm()

  const [hover, setHover] = useState(false)

  const errorToast = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Controller
        control={control}
        name={refName}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, onBlur, value, ref }) => (
          <div>
            {hover || value !== defaultValue ? (
              <Input
                m={-2}
                variant="filled"
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
            {value !== defaultValue ? (
              <div>
                <IconButton
                  aria-label="reset"
                  icon={<CloseIcon />}
                  onClick={() => {
                    setHover(false)
                    onChange(defaultValue)
                  }}
                />
                <IconButton
                  aria-label="check"
                  type="submit"
                  icon={<CheckIcon />}
                  onClick={() => {
                    if (errors[refName]) {
                      errorToast({
                        description: errors[refName].message,
                        status: 'error',
                        duration: 3e3,
                        isClosable: true,
                      })
                    } else {
                      setHover(false)
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        )}
      />
    </form>
  )
}

export default HoverableTextField
