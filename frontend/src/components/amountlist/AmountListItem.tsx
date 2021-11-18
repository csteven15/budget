import { FC, useState, useEffect } from 'react'
import { Button, Grid, GridItem, Input } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

interface AmountListItemProps {
  type: string
  nameValue?: string | number | readonly string[] | undefined
  amountValue?: string | number | readonly string[] | undefined
  addOrUpdateData: (name: string, amount: number) => void
  deleteData: (name: string) => void
  mainInput: boolean
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
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (nameValue) setName(nameValue as string)
    if (amountValue) setAmount(amountValue as number)
  }, [nameValue, amountValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addOrUpdateData(name, amount)
      if (mainInput) {
        setName('')
        setAmount(0)
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
          <Input
            focusBorderColor="lime"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            onKeyDown={handleKeyDown}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Button
            onClick={() => {
              deleteData(nameValue as string)
            }}
          >
            <DeleteIcon />
          </Button>
        </GridItem>
      </Grid>
    </>
  )
}

export default AmountListItem
