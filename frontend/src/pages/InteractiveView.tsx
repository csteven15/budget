import { FC, useState, useEffect } from 'react'
import {
  Button,
  Flex,
  Input,
  Stack,
  StackProps,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react'

import AmountList from '../components/AmountList'
import StatWrapper from '../components/StatWrapper'

// TODO: remove duplicate
interface AmountListItemContent {
  name: string
  nameSetter: React.Dispatch<React.SetStateAction<string>>
  amount: number
  setter: React.Dispatch<React.SetStateAction<number>>
  type: string
}

const InteractiveView: FC = () => {
  const [totalInBank, setTotalInBank] = useState(0)
  const [netIncome, setNetIncome] = useState(0)
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [expenseTotal, setExpenseTotal] = useState(0)

  const [budgetData, appendBudgetData] = useState<AmountListItemContent[]>([])
  const [budgetName, setBudgetName] = useState('')

  const calculateBalance = () => {
    if (isNaN(incomeTotal) || isNaN(expenseTotal)) {
      // add toast
      return
    }
    setNetIncome(incomeTotal - expenseTotal)
  }

  useEffect(() => {
    calculateBalance()
  }, [incomeTotal, expenseTotal])

  const RenderList = (
    type: string,
    placeholder: string,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    return (
      <AmountList
        type={type}
        amountPlaceholder={placeholder}
        setTotal={setter}
        appendBudgetData={appendBudgetData}
      />
    )
  }

  const RenderTotalStat = (label: string, mutliplier?: number) => {
    return (
      <StatWrapper
        label={label}
        initialValue={totalInBank}
        value={netIncome}
        multiplier={mutliplier}
      />
    )
  }

  const stackProps: StackProps = {
    spacing: 4,
    direction: { base: 'column', lg: 'row' },
    align: 'center',
  }

  return (
    <VStack divider={<StackDivider />} spacing={4} align="stretch">
      {RenderList('Bank Account', 'Account Balance', setTotalInBank)}
      {RenderList('Income', 'Monthly Amount', setIncomeTotal)}
      {RenderList('Expense', 'Monthly Amount', setExpenseTotal)}
      <>
        <Flex>
          <Input
            placeholder="Enter Budget Name"
            value={budgetName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBudgetName(e.target.value)
            }
          />
          {/* // TODO: save off json data and budget name to database */}
          <Button
            onClick={() => {
              setBudgetName(budgetName)
              console.log(
                'Saving ',
                budgetName,
                ' with ',
                JSON.stringify(budgetData)
              )
            }}
          >
            Save
          </Button>
          {/* // TODO: add drawer to open for selecting a budget to load */}
          <Button>Load</Button>
        </Flex>
      </>
      <>
        <Text align="left" fontWeight="bold">
          Net Income
        </Text>
        <Stack {...stackProps}>
          <StatWrapper label="Income Total" value={incomeTotal} />
          <Text fontWeight="bold">-</Text>
          <StatWrapper label="Expense Total" value={expenseTotal} />
          <Text fontWeight="bold">=</Text>
          <StatWrapper label="Net Income" value={netIncome} />
        </Stack>
      </>
      <>
        <Text align="left" fontWeight="bold">
          Stats
        </Text>
        <Stack {...stackProps}>
          {RenderTotalStat('End of Month Total')}
          {RenderTotalStat('End of Year Total', 12)}
          {RenderTotalStat('End of 5 Year Total', 12 * 5)}
          {RenderTotalStat('End of 10 Year Total', 12 * 10)}
        </Stack>
      </>
    </VStack>
  )
}

export default InteractiveView
