import { FC, useState, useEffect } from 'react'
import {
  Button,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Switch,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { AmountListItemContent } from './AmountListItemContent'

const defaultFrequency = 'monthly'

interface AmountListItemProps {
  type: string
  currentItemContent?: AmountListItemContent
  addOrUpdateData: (data: AmountListItemContent) => void
  deleteData: (name: string) => void
  mainInput?: boolean
  recurringList?: boolean
}

const AmountListItem: FC<AmountListItemProps> = ({
  type,
  currentItemContent,
  addOrUpdateData,
  deleteData,
  mainInput,
  recurringList,
}) => {
  const [tempName, setTempName] = useState('')
  const [tempAmount, setTempAmount] = useState('')
  const [tempApplied, setTempApplied] = useState(true)
  const [tempFrequency, setTempFrequency] = useState(defaultFrequency)

  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (currentItemContent) {
      setTempName(currentItemContent.name)
      setTempAmount(currentItemContent.amount.toString())
      setTempApplied(currentItemContent.applied)
      if (currentItemContent.frequency !== undefined)
        setTempFrequency(currentItemContent.frequency)
      setIsValid(true)
    }
  }, [currentItemContent])

  const addOrUpdateDataIfValid = (data: AmountListItemContent) => {
    if (!isValid || data.name == '') return
    addOrUpdateData(data)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsValid(!isNaN(parseInt(tempAmount)) && parseInt(tempAmount) > 0)
    if (e.key === 'Enter') {
      addOrUpdateDataIfValid({
        type: type,
        name: tempName,
        amount: parseInt(tempAmount),
        applied: true,
      })
      if (mainInput !== undefined && mainInput) {
        setTempName('')
        setTempAmount('')
        setTempApplied(true)
        setTempFrequency(defaultFrequency)
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
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
        </GridItem>
        <GridItem colSpan={recurringList ? 1 : 2}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">$</InputLeftElement>
            <Input
              focusBorderColor="lime"
              placeholder="Amount"
              isInvalid={!isValid}
              errorBorderColor={tempAmount.length > 0 ? 'red.300' : 'none'}
              value={tempAmount}
              onChange={(e) => setTempAmount(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </GridItem>
        {recurringList ? (
          <GridItem colSpan={1}>
            <Select
              value={tempFrequency}
              onChange={(e) => {
                addOrUpdateDataIfValid({
                  type: type,
                  name: tempName,
                  amount: parseInt(tempAmount),
                  applied: tempApplied,
                  frequency: e.target.value,
                })
              }}
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
              <option value="semiannual">Semiannual</option>
              <option value="annual">Annual</option>
              <option value="once">Once</option>
            </Select>
          </GridItem>
        ) : null}
        {!mainInput ? (
          <GridItem colSpan={1}>
            <Switch
              colorScheme="teal"
              isChecked={tempApplied}
              onChange={(e) => {
                addOrUpdateDataIfValid({
                  type: type,
                  name: tempName,
                  amount: parseInt(tempAmount),
                  applied: e.target.checked,
                })
              }}
            />
            <Button
              onClick={() => {
                deleteData(tempName)
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
