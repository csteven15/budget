import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { EInputType } from '../common/enums/index'
import { Box } from '@chakra-ui/layout'
import { Grid } from '@chakra-ui/react'
import HoverableTextField from '../components/forms/HoverableTextfield'

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
        date
        amount
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

interface IEntryInfo {
  name: string
  budgetedAmount: number
  createdAt: Date
  startDate: Date
  endDate: Date
}

// Fills whole width
const EntryInfo: FC<IEntryInfo> = ({
  name,
  budgetedAmount,
  createdAt,
  startDate,
  endDate,
}) => {
  console.log(name, budgetedAmount, createdAt, startDate, endDate)
  return (
    <Grid templateColumns="repeat(5, 1fr)" m={2}>
      <Box>
        <HoverableTextField refName="name" defaultValue={name} />
      </Box>
      <Box>
        <HoverableTextField
          refName="budgetedAmount"
          defaultValue={budgetedAmount}
          rules={{
            min: { value: 0, message: 'No negative numbers' },
            valueAsNumber: true,
            required: { value: true, message: 'Required' },
            pattern: {
              value: /^\d+\.?\d*$/,
              message: 'Wrong format: E.g. 100.00',
            },
          }}
        />
      </Box>
      <Box>{createdAt.toString()}</Box>
      <Box>{startDate.toString()}</Box>
      <Box>{endDate.toString()}</Box>
    </Grid>
  )
}

const ListView: FC = () => {
  const incomeQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Income)
  )
  const ExpenseQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Expense)
  )

  console.log(incomeQuery.data)

  const renderListOfEntriesByType = (entries: IEntryInfo[]) => {
    return entries?.map((entry) => <EntryInfo key={entry.name} {...entry} />)
  }

  return (
    <Box w="100%">
      {renderListOfEntriesByType(incomeQuery.data?.entries)}
      {renderListOfEntriesByType(ExpenseQuery.data?.entries)}
    </Box>
  )
}

export default ListView
