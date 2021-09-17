import React, { FC, useState } from 'react'
import { NumberInput, NumberInputField } from '@chakra-ui/number-input'

interface EditableAmountProps {
  defaultValue: number
  maxWidth?: number
  size?: string
}

const EditableAmount: FC<EditableAmountProps> = ({
  defaultValue,
  maxWidth,
  size,
}) => {
  const format = (value: string) => '$' + value
  const parse = (value: string) => value.replace(/^\$/, '')
  const [value, setValue] = useState(defaultValue.toFixed(2).toString())
  return (
    <NumberInput
      onChange={(valueString) => setValue(parse(valueString))}
      value={format(value)}
      precision={2}
      size={size == undefined ? 'sm' : size}
      maxW={maxWidth == undefined ? 32 : maxWidth}
      step={10}
      allowMouseWheel
    >
      <NumberInputField />
    </NumberInput>
  )
}

export default EditableAmount
