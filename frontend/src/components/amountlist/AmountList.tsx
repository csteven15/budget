import { Dispatch, FC, SetStateAction } from 'react'
import { Text } from '@chakra-ui/react'

import AmountListItem from './AmountListItem'

interface AmountListItemContent {
  name: string
  amount: number
  type: string
  applied: boolean
  frequency?: string
}

interface AmountListProps {
  type: string
  budgetData: Array<AmountListItemContent>
  setBudgetData: Dispatch<SetStateAction<Array<AmountListItemContent>>>
  recurringList?: boolean
}

const AmountList: FC<AmountListProps> = ({
  type,
  budgetData,
  setBudgetData,
  recurringList,
}) => {
  const deleteData = (name: string) => {
    const filteredBudgetData = budgetData.filter((data) => data.name !== name)
    setBudgetData(filteredBudgetData)
  }

  const updateData = (newData: AmountListItemContent) => {
    const updatedBudgetData = budgetData.filter(
      (data) => data.name !== newData.name
    )
    updatedBudgetData.push(newData)
    setBudgetData(updatedBudgetData)
  }

  const addData = (newData: AmountListItemContent) => {
    setBudgetData((data: Array<AmountListItemContent>) => [...data, newData])
  }

  const addOrUpdateData = (newData: AmountListItemContent) => {
    const dataExists = budgetData.some(
      (data) => data.name === newData.name && data.type === newData.type
    )
    if (dataExists) {
      updateData(newData)
    } else {
      addData(newData)
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
            currentItemContent={data}
            type={type}
            addOrUpdateData={addOrUpdateData}
            deleteData={deleteData}
            recurringList={recurringList}
          />
        ) : null
      )}
      <AmountListItem
        type={type}
        addOrUpdateData={addOrUpdateData}
        deleteData={deleteData}
        mainInput
        recurringList={recurringList}
      />
    </>
  )
}

export default AmountList
