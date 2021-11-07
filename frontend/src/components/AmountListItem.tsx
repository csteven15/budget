import { FC, useState } from 'react'
import { Box, Input, SimpleGrid } from '@chakra-ui/react'

import AmountInput from '../components/AmountInput'

interface AmountListItemProps {
  type: string
  amountPlaceholder: string
  setNameFunction: React.Dispatch<React.SetStateAction<string>>
  setAmountFunction: React.Dispatch<React.SetStateAction<number>>
}

const AmountListItem: FC<AmountListItemProps> = ({
  type,
  amountPlaceholder,
  setNameFunction,
  setAmountFunction,
}) => {
  const [name, setName] = useState('')
  return (
    <SimpleGrid columns={2}>
      <Box>
        <Input
          focusBorderColor="lime"
          placeholder={type + ' Name'}
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          onBlur={() => setNameFunction(name)}
        />
      </Box>
      <Box>
        <AmountInput
          placeholder={amountPlaceholder}
          setFunction={setAmountFunction}
        />
      </Box>
    </SimpleGrid>
  )
}

export default AmountListItem
