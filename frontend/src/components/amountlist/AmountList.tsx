import { Dispatch, FC, SetStateAction } from 'react'
import { Text } from '@chakra-ui/react'

import AmountListItem from './AmountListItem'

interface AmountListItemContent {
  name: string
  amount: number
  type: string
}

interface AmountListProps {
  type: string
  budgetData: Array<AmountListItemContent>
  setBudgetData: Dispatch<SetStateAction<Array<AmountListItemContent>>>
}

const AmountList: FC<AmountListProps> = ({
  type,
  budgetData,
  setBudgetData,
}) => {
  const deleteData = (name: string) => {
    const filteredBudgetData = budgetData.filter((data) => data.name !== name)
    setBudgetData(filteredBudgetData)
  }

  const updateData = (name: string, amount: number) => {
    const updatedBudgetData = budgetData.filter((data) => data.name !== name)
    updatedBudgetData.push({
      type,
      name,
      amount,
    })
    setBudgetData(updatedBudgetData)
  }

  const addData = (name: string, amount: number) => {
    setBudgetData((data: Array<AmountListItemContent>) => [
      ...data,
      {
        type,
        name,
        amount,
      },
    ])
  }

  const addOrUpdateData = (name: string, amount: number) => {
    const dataExists = budgetData.some(
      (data) => data.name === name && data.type === type
    )
    if (dataExists) {
      updateData(name, amount)
    } else {
      addData(name, amount)
    }
  }

  return (
    <>
      <Text align="left" fontWeight="bold">
        {type + ' List'}
      </Text>
      {budgetData.map((data, key) =>
        data.type === type ? (
          <AmountListItem
            key={key}
            nameValue={data.name}
            amountValue={data.amount}
            type={type}
            addOrUpdateData={addOrUpdateData}
            deleteData={deleteData}
            mainInput={false}
          />
        ) : null
      )}

      <AmountListItem
        type={type}
        addOrUpdateData={addOrUpdateData}
        deleteData={deleteData}
        mainInput={true}
      />
    </>
  )
}

export default AmountList
