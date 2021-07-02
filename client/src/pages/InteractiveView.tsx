import React, { FC } from 'react'
import { Table, Tbody, Thead, Td, Tr } from '@chakra-ui/table'
import { Flex, Text } from '@chakra-ui/layout'

import { useAccountYearQuery } from '../hooks/useAccountQuery'
import { useEntryQueryYear } from '../hooks/useEntryQuery'

import EditableAmount from '../components/forms/EditableAmount'
import { EEntryType, MonthArray } from '../common/enums/index'
import { IEntry, IAmount, IAccount } from '../common/types/index'

interface TotalType {
  budgeted: number
  actual: number
}

interface InteractiveViewProps {
  date: Date
}

const InteractiveView: FC<InteractiveViewProps> = ({ date }) => {
  const { data: appliedAccounts } = useAccountYearQuery()
  const { data: entriesForYear } = useEntryQueryYear(date)
  const getTotalsForEachMonth = (entries: IEntry[]) => {
    const totals: TotalType[] = []
    for (let i = 0; i < MonthArray.length; i++) {
      const total: TotalType = { budgeted: 0, actual: 0 }
      entries?.forEach((entry: IEntry) => {
        entry?.amounts?.forEach((amount: IAmount) => {
          if (new Date(amount.date).getMonth() === i) {
            total.budgeted += entry.budgetedAmount
            total.actual += amount.amount
          }
        })
      })
      totals.push(total)
    }
    return totals
  }
  const getEndOfMonthTotals = (
    totalInBank: number,
    income: TotalType[],
    expense: TotalType[]
  ) => {
    const totals: number[] = []
    let lastMonthTotal = totalInBank
    for (let i = 0; i < MonthArray.length; i++) {
      const endOfMonthBankTotal =
        lastMonthTotal + (income[i].actual - expense[i].actual)
      totals.push(endOfMonthBankTotal)
      lastMonthTotal = endOfMonthBankTotal
    }
    return totals
  }
  const income = entriesForYear?.entries?.filter(
    (entry: IEntry) => entry.type === EEntryType.Income
  )
  const expenses = entriesForYear?.entries?.filter(
    (entry: IEntry) => entry.type === EEntryType.Expense
  )
  const incomeTotals = getTotalsForEachMonth(income)
  const expenseTotals = getTotalsForEachMonth(expenses)
  const endOfMonthBankTotals = getEndOfMonthTotals(
    appliedAccounts?.accounts?.reduce(
      (total: number, account: IAccount) => (total += account.total),
      0
    ),
    incomeTotals,
    expenseTotals
  )

  return (
    <Table
      variant="striped"
      colorScheme="linkedin"
      size="xs"
      fontSize="sm"
      overflowX="scroll"
    >
      <Thead>
        <Tr fontWeight="bold">
          <Td></Td>
          {income?.map((income: IEntry, key: number) => {
            return <Td key={key}>{income.name}</Td>
          })}
          {expenses?.map((expense: IEntry, key: number) => {
            return <Td key={key}>{expense.name}</Td>
          })}
          <Td>Balance</Td>
          <Td>Total In Bank</Td>
        </Tr>
      </Thead>
      <Tbody>
        {MonthArray.map((month: string, i: number) => {
          return (
            <Tr key={i} overflowX="scroll">
              <Td fontWeight="bold">{month.substring(0, 3)}</Td>
              {income?.map((income: IEntry, key: number) => {
                return (
                  <Td key={key} isNumeric>
                    <EditableAmount defaultValue={income.budgetedAmount * 4} />
                  </Td>
                )
              })}
              {expenses?.map((expense: IEntry, key: number) => {
                return (
                  <Td key={key}>
                    <EditableAmount defaultValue={expense.budgetedAmount} />
                  </Td>
                )
              })}
              <Td>
                <Flex>
                  <Text>$</Text>
                  {(incomeTotals[i].actual - expenseTotals[i].actual).toFixed(
                    2
                  )}
                </Flex>
              </Td>
              <Td>
                <Flex>
                  <Text>$</Text>
                  {endOfMonthBankTotals[i].toFixed(2)}
                </Flex>
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export default InteractiveView
