import { FC, useState, useEffect } from 'react'
import {
  Button,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

interface AmountListItemProps {
  type: string
  nameValue?: string | number | readonly string[] | undefined
  amountValue?: string | number | readonly string[] | undefined
  addOrUpdateData: (name: string, amount: number) => void
  deleteData: (name: string) => void
  mainInput?: boolean
}

const AmountListItem: FC<AmountListItemProps> = ({
  type,
  nameValue,
  amountValue,
  addOrUpdateData,
  deleteData,
  mainInput,
}) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (nameValue) setName(nameValue as string)
    if (amountValue) setAmount(amountValue as string)
  }, [nameValue, amountValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsValid(!isNaN(parseInt(amount)) && parseInt(amount) > 0)
    if (e.key === 'Enter' && isValid) {
      addOrUpdateData(name, parseInt(amount))
      if (mainInput !== undefined && mainInput) {
        setName('')
        setAmount('')
      }
    }
  }

  return (
    <>
      <Grid templateColumns="repeat(5, 1fr)" gap={1}>
        <GridItem colSpan={2}>
          <Input
            focusBorderColor="lime"
            placeholder={type + ' Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">$</InputLeftElement>
            <Input
              focusBorderColor="lime"
              placeholder="Amount"
              isInvalid={!isValid}
              errorBorderColor={amount.length > 0 ? 'red.300' : 'none'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </GridItem>
        {!mainInput ? (
          <GridItem colSpan={1}>
            <Button
              onClick={() => {
                deleteData(nameValue as string)
              }}
            >
              <DeleteIcon />
            </Button>
          </GridItem>
        ) : null}
      </Grid>
    </>
  )
}

export default AmountListItem
