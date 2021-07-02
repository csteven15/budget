import { FC } from 'react'
import { Table, Thead, Tbody, Tr, Td } from '@chakra-ui/react'

import { useAccountYearQuery } from '../hooks/useAccountQuery'
import { useEntryQueryYear } from '../hooks/useEntryQuery'

import { EEntryType, MonthArray } from '../common/enums/index'
import { IEntry, IAmount, IAccount } from '../common/types/index'

interface TotalType {
  budgeted: number
  actual: number
}

interface MonthInfoProps {
  header: string
  budgetedIncome: string
  actualIncome: string
  budgetedExpenses: string
  actualExpenses: string
  balance: string
  totalInBank: string
  isHeader?: boolean
}

const MonthInfo: FC<MonthInfoProps> = ({
  header,
  budgetedIncome,
  actualIncome,
  budgetedExpenses,
  actualExpenses,
  balance,
  totalInBank,
  isHeader,
}) => {
  return (
    <Tr>
      {isHeader ? (
        <>
          <Td fontWeight="bold">{header}</Td>
          <Td fontWeight="bold">{budgetedIncome}</Td>
          <Td fontWeight="bold">{actualIncome}</Td>
          <Td fontWeight="bold">{budgetedExpenses}</Td>
          <Td fontWeight="bold">{actualExpenses}</Td>
          <Td fontWeight="bold">{balance}</Td>
          <Td fontWeight="bold">{totalInBank}</Td>
        </>
      ) : (
        <>
          <Td fontWeight="bold">{header}</Td>
          <Td isNumeric>{'$' + budgetedIncome}</Td>
          <Td isNumeric>{'$' + actualIncome}</Td>
          <Td isNumeric>{'$' + budgetedExpenses}</Td>
          <Td isNumeric>{'$' + actualExpenses}</Td>
          <Td isNumeric>{'$' + balance}</Td>
          <Td isNumeric>{'$' + totalInBank}</Td>
        </>
      )}
    </Tr>
  )
}

interface YearViewProps {
  date: Date
}

const YearView: FC<YearViewProps> = ({ date }) => {
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
    <Table variant="striped" size="md" colorScheme="blue">
      <Thead>
        <MonthInfo
          header={'Month'}
          budgetedIncome={'Budgeted Income'}
          actualIncome={'Actual Income'}
          budgetedExpenses={'Budgeted Expenses'}
          actualExpenses={'Actual Expenses'}
          balance={'Balance'}
          totalInBank={'Total In Bank'}
          isHeader={true}
        />
      </Thead>
      <Tbody>
        {MonthArray.map((month: string, i: number) => {
          return (
            <MonthInfo
              key={i}
              header={month}
              budgetedIncome={incomeTotals[i].budgeted.toFixed(2).toString()}
              actualIncome={incomeTotals[i].actual.toFixed(2).toString()}
              budgetedExpenses={expenseTotals[i].budgeted.toFixed(2).toString()}
              actualExpenses={expenseTotals[i].actual.toFixed(2).toString()}
              balance={(incomeTotals[i].actual - expenseTotals[i].actual)
                .toFixed(2)
                .toString()}
              totalInBank={endOfMonthBankTotals[i].toFixed(2).toString()}
            />
          )
        })}
      </Tbody>
    </Table>
  )
}

export default YearView
