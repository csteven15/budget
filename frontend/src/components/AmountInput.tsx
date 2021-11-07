import { FC, useState } from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'

interface AmountInputProps {
  placeholder: string
  setFunction: React.Dispatch<React.SetStateAction<number>>
}

const AmountInput: FC<AmountInputProps> = ({ placeholder, setFunction }) => {
  const [possibleInput, setPossibleInput] = useState('')
  const [isValid, setIsValid] = useState(false)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsValid(!isNaN(parseInt(possibleInput)))
    if (e.key === 'Enter' && isValid) {
      setFunction(parseInt(possibleInput))
      setPossibleInput(
        parseInt(possibleInput).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })
      )
    }
  }
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">$</InputLeftElement>
      <Input
        focusBorderColor="lime"
        isInvalid={!isValid}
        errorBorderColor={possibleInput.length > 0 ? 'red.300' : 'none'}
        placeholder={placeholder}
        value={possibleInput}
        onKeyDown={handleKeyDown}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPossibleInput(e.target.value)
        }
      />
    </InputGroup>
  )
}

export default AmountInput
