import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react'
import { EInputType } from '../common/enums/index'
import { IAmount, IEntry } from '../common/types'

const MonthView: FC = () => {
  return <div>Month View</div>
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput) {
    entries(filter: $filter, payload: $payload) {
      name
      _id
      type
      budgetedAmount
      startDate
      endDate
      createdAt
      amounts {
        amount
        date
        paid
      }
    }
  }
`
const date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth()

const createQueryForType = (type: EInputType) => {
  return {
    variables: {
      filter: {
        startDate: new Date(y, m, 1),
        endDate: new Date(y, m + 1, 0),
      },
      payload: {
        type: type,
      },
    },
  }
}

const YearView: FC = () => {
  const incomeQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Income)
  )
  const expenseQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Expense)
  )

  const getBudgetedTotal = (entries: IEntry[]) => {
    return entries.reduce(
      (total: number, i: IEntry) => (total += i.budgetedAmount),
      0
    )
  }

  const getActualTotals = (entries: IEntry[]) => {
    const totals: Array<number> = []
    entries.map((entry: IEntry) => {
      let prevMonth = 0
      let total = 0
      console.log('amounts', entry.amounts)
      entry?.amounts?.map((amount: IAmount) => {
        const amountDate = new Date(amount.date)
        if (amountDate.getMonth() === prevMonth) {
          total = total + amount.amount
        } else {
          totals.push(total)
          console.log(totals, prevMonth)
          prevMonth++
        }
      })
    })
    return totals
  }

  let totalBudgetedIncome = 0
  let totalBudgetedExpenses = 0
  let totalActualIncome = 0
  let totalActualExpenses = 0
  if (incomeQuery.data && expenseQuery.data) {
    totalBudgetedIncome = getBudgetedTotal(incomeQuery.data?.entries)
    totalBudgetedExpenses = getBudgetedTotal(expenseQuery.data?.entries)
    totalActualIncome = getActualTotals(incomeQuery.data?.entries)[0]
    totalActualExpenses = getActualTotals(expenseQuery.data?.entries)[0]
    console.log(incomeQuery.data?.entries)
    console.log(expenseQuery.data?.entries)
  }
  return (
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Month</Th>
          <Th>Budgeted Income</Th>
          <Th>Actual Income</Th>
          <Th>Budgeted Expenses</Th>
          <Th>Actual Expenses</Th>
          <Th>Balance</Th>
          <Th>Total In Bank</Th>
        </Tr>
      </Thead>
      <Tbody>
        {months.map((month: string, i: number) => {
          return (
            <Tr key={i}>
              <Th>{month}</Th>
              <Th>{totalBudgetedIncome}</Th>
              <Th>{totalActualIncome}</Th>
              <Th>{totalBudgetedExpenses}</Th>
              <Th>{totalActualExpenses}</Th>
              <Th>{totalActualIncome - totalActualExpenses}</Th>
              <Th>-</Th>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

const DataTabs: FC = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Month View</Tab>
        <Tab>Year View</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <MonthView />
        </TabPanel>
        <TabPanel>
          <YearView />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const BudgetView: FC = () => {
  return <DataTabs />
}

export default BudgetView
