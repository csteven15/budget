import { FC, useState, useEffect } from 'react'
import { Stack, StackDivider, Text, VStack } from '@chakra-ui/react'

import AmountList from '../components/AmountList'
import StatWrapper from '../components/StatWrapper'

const InteractiveView: FC = () => {
  const [totalInBank, setTotalInBank] = useState(0)
  const [netIncome, setNetIncome] = useState(0)
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [expenseTotal, setExpenseTotal] = useState(0)

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

  return (
    <VStack divider={<StackDivider />} spacing={4} align="stretch">
      <AmountList
        type="Bank Account"
        amountPlaceholder="Account Balance"
        setTotal={setTotalInBank}
      />
      <AmountList
        type="Income"
        amountPlaceholder={'Monthly Amount'}
        setTotal={setIncomeTotal}
      />
      <AmountList
        type="Expense"
        amountPlaceholder={'Monthly Amount'}
        setTotal={setExpenseTotal}
      />
      <>
        <Text align="left" fontWeight="bold">
          Net Income
        </Text>
        <Stack
          spacing={4}
          direction={{ base: 'column', lg: 'row' }}
          align="center"
        >
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
        <Stack
          spacing={4}
          direction={{ base: 'column', lg: 'row' }}
          align="center"
        >
          <StatWrapper
            label="End of Month Total"
            value={totalInBank + netIncome}
          />
          <StatWrapper
            label="End of Year Total"
            value={totalInBank + netIncome}
            multiplier={12}
          />
          <StatWrapper
            label="End of 5 Year Total"
            value={totalInBank + netIncome}
            multiplier={12 * 5}
          />
          <StatWrapper
            label="End of 10 Year Total"
            value={totalInBank + netIncome}
            multiplier={12 * 10}
          />
        </Stack>
      </>
    </VStack>
  )
}

export default InteractiveView
