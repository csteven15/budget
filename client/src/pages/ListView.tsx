import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { EInputType } from '../common/enums/index'
import { Box } from '@chakra-ui/layout'
import { Grid, Text } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import EditableDatePicker from '../components/forms/EditableDatePicker'
import EditableTextField from '../components/forms/EditableTextField'

const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput) {
    entries(filter: $filter, payload: $payload) {
      name
      userId
      _id
      type
      budgetedAmount
      startDate
      endDate
      createdAt
      amounts {
        amount
      }
    }
  }
`

const date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth()

const createQueryForType = (type: EInputType, userId: string) => {
  return {
    variables: {
      filter: {
        startDate: new Date(y, m, 1),
        endDate: new Date(y, m + 1, 0),
      },
      payload: {
        type: type,
        userId: userId,
      },
    },
  }
}

interface IEntryInfo {
  _id: string
  name: string
  budgetedAmount: number
  createdAt: Date
  startDate: Date
  endDate: Date
}

// Fills whole width
const EntryInfo: FC<IEntryInfo> = ({
  _id,
  name,
  budgetedAmount,
  createdAt,
  startDate,
  endDate,
}) => {
  const localCreatedAt = new Date(createdAt)
  return (
    <Grid templateColumns="repeat(5, 1fr)" m={2}>
      <Box>
        <EditableTextField
          refName="name"
          id={_id}
          defaultValue={name}
          rules={{
            required: { value: true, message: 'Required' },
          }}
        />
      </Box>
      <Box>
        <EditableTextField
          refName="budgetedAmount"
          id={_id}
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
      <Box>
        <Text>{localCreatedAt.toLocaleDateString()}</Text>
      </Box>
      <Box>
        <EditableDatePicker
          id={_id}
          refName="startDate"
          defaultValue={new Date(startDate)}
          isClearable={true}
          showPopperArrow={true}
        />
      </Box>
      <Box>
        <EditableDatePicker
          id={_id}
          refName="endDate"
          defaultValue={new Date(endDate)}
          isClearable={true}
          showPopperArrow={true}
        />
      </Box>
    </Grid>
  )
}

const ListView: FC = () => {
  const { user } = useAuth()
  const incomeQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Income, user?.uid as string)
  )
  const expenseQuery = useQuery(
    GET_ENTRIES,
    createQueryForType(EInputType.Expense, user?.uid as string)
  )

  const HeaderForEntries: FC = () => (
    <Grid templateColumns="repeat(5, 1fr)" m={2}>
      <Box>
        <Text>Name</Text>
      </Box>
      <Box>
        <Text>Budgeted Amount</Text>
      </Box>
      <Box>
        <Text>Created On</Text>
      </Box>
      <Box>
        <Text>Start Date</Text>
      </Box>
      <Box>
        <Text>End Date</Text>
      </Box>
    </Grid>
  )

  const renderListOfEntriesByType = (entries: IEntryInfo[]) =>
    entries?.map((entry) => <EntryInfo key={entry.name} {...entry} />)

  return (
    <Box w="100%">
      <HeaderForEntries />
      {renderListOfEntriesByType(incomeQuery.data?.entries)}
      {renderListOfEntriesByType(expenseQuery.data?.entries)}
    </Box>
  )
}

export default ListView
