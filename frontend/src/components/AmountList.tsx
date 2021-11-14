import { FC, useState, useEffect } from 'react'
import { Text } from '@chakra-ui/react'

import AmountListItem from '../components/AmountListItem'

interface AmountListItemContent {
  name: string
  nameSetter: React.Dispatch<React.SetStateAction<string>>
  amount: number
  setter: React.Dispatch<React.SetStateAction<number>>
  type: string
}

interface AmountListProps {
  type: string
  amountPlaceholder: string
  setTotal: React.Dispatch<React.SetStateAction<number>>
  appendBudgetData: React.Dispatch<
    React.SetStateAction<AmountListItemContent[]>
  >
}

const AmountList: FC<AmountListProps> = ({
  type,
  amountPlaceholder,
  setTotal,
  appendBudgetData,
}) => {
  const [amounts, setAmounts] = useState<AmountListItemContent[]>([])
  const [newAmount, setNewAmount] = useState(0)
  const [newName, setNewName] = useState('')

  const updateAmount = (amountIndex: number, amount: AmountListItemContent) => {
    const newAmounts = [...amounts]
    newAmounts[amountIndex] = amount
    setAmounts(newAmounts)
  }

  useEffect(() => {
    const newItem: AmountListItemContent = {
      name: newName,
      nameSetter: setNewName,
      amount: newAmount,
      setter: setNewAmount,
      type: type,
    }
    const indexIfFound = amounts.findIndex((data) => data.name === newItem.name)
    if (indexIfFound === -1 && newItem.name !== '') {
      setAmounts((oldAmounts) => [...oldAmounts, newItem])
      appendBudgetData((budgetData) => [...budgetData, newItem])
    } else {
      updateAmount(indexIfFound, newItem)
    }
  }, [newAmount])

  useEffect(() => {
    const total = amounts.reduce((t, c) => (t = t + c.amount), 0)
    setTotal(total)
  }, [amounts])

  return (
    <>
      <Text align="left" fontWeight="bold">
        {type + ' List'}
      </Text>
      <AmountListItem
        type={type}
        amountPlaceholder={amountPlaceholder}
        setNameFunction={setNewName}
        setAmountFunction={setNewAmount}
      />
      {amounts.map(({ nameSetter, setter }, key) => {
        return (
          <AmountListItem
            key={key}
            type={type}
            amountPlaceholder={amountPlaceholder}
            setNameFunction={nameSetter}
            setAmountFunction={setter}
          />
        )
      })}
    </>
  )
}

export default AmountList
