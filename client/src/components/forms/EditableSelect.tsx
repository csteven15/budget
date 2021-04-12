import { FC, useEffect, useRef, useState } from 'react'
import { theme, IconButton, Text, Box, Flex, Select } from '@chakra-ui/react'
import { CloseIcon, CheckIcon } from '@chakra-ui/icons'
import { Controller, useForm } from 'react-hook-form'

import { useGenericMutation } from '../../hooks/useGenericMutation'

import { TextToValue } from '../../common/enums/Generic'

interface IEditableSelect {
  id: string
  refName: string
  defaultValue: number
  mutationSchema: string
  textToValueMapping: TextToValue[]
}

const EditableSelect: FC<IEditableSelect> = ({
  id,
  refName,
  defaultValue,
  mutationSchema,
  textToValueMapping,
}) => {
  const { errors, handleSubmit, control } = useForm()

  const { mutate } = useGenericMutation(mutationSchema)

  const [selectOpen, setSelectOpen] = useState(false)

  const [hover, setHover] = useState(false)

  const [trackedValue, setTrackedValue] = useState(defaultValue)

  const selectRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handler(event: any) {
      if (!selectRef?.current?.contains(event?.target)) {
        setSelectOpen(false)
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setTrackedValue(data[refName])
    setHover(false)
    mutate({
      payload: {
        _id: id,
        type: parseInt(data[refName]),
      },
    })
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      ref={selectRef}
    >
      <Controller
        control={control}
        name={refName}
        defaultValue={defaultValue}
        render={({ onChange, onBlur, value }) => (
          <Flex>
            <Box>
              {hover || selectOpen || value !== trackedValue ? (
                <Select
                  my={-2}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  variant="unstyled"
                  isInvalid={errors[refName]}
                  errorBorderColor={theme.colors.red[300]}
                  onClick={() => setSelectOpen(true)}
                >
                  {textToValueMapping.map((input) => (
                    <option
                      onClick={() => setSelectOpen(false)}
                      key={input.value}
                      value={input.value}
                    >
                      {input.text}
                    </option>
                  ))}
                </Select>
              ) : (
                <Text>{textToValueMapping[value].text}</Text>
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
                      setSelectOpen(false)
                    }}
                  />
                </Box>
                <Box>
                  <IconButton
                    my={-3}
                    aria-label="check"
                    icon={<CheckIcon />}
                    onClick={handleSubmit(onSubmit)}
                  />
                </Box>
              </>
            ) : null}
          </Flex>
        )}
      />
    </div>
  )
}

export default EditableSelect
