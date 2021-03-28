import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import EditableDatePicker from '../components/forms/EditableDatePicker'
import EditableTextField from '../components/forms/EditableTextField'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { IAmount } from '../common/types'
import { UPDATE_ENTRY_MUTATION } from '../common/gql/Mutations'
import EditableSelect from '../components/forms/EditableSelect'
import { EEntryValues } from '../common/enums'

const GET_ENTRIES = gql`
  query entries($filter: GetEntryDateFilterInput, $payload: GetEntryInput!) {
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
        date
        paid
      }
    }
  }
`

interface IEntryInfo {
  _id: string
  name: string
  type: number
  budgetedAmount: number
  createdAt: Date
  startDate: Date
  endDate: Date
  amounts: IAmount[]
}

// Fills whole width
const EntryInfo: FC<IEntryInfo> = ({
  _id,
  name,
  type,
  budgetedAmount,
  createdAt,
  startDate,
  endDate,
  amounts,
}) => {
  const localCreatedAt = new Date(createdAt)
  const { isOpen, onToggle } = useDisclosure()
  return (
    <>
      <Grid templateColumns="repeat(7, 1fr)" m={2}>
        <Box>
          <EditableTextField
            refName="name"
            id={_id}
            defaultValue={name}
            rules={{
              required: { value: true, message: 'Required' },
            }}
            mutationSchema={UPDATE_ENTRY_MUTATION}
          />
        </Box>
        <Box>
          <EditableSelect
            refName="type"
            id={_id}
            defaultValue={type}
            mutationSchema={UPDATE_ENTRY_MUTATION}
            textToValueMapping={EEntryValues}
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
            mutationSchema={UPDATE_ENTRY_MUTATION}
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
            mutationSchema={UPDATE_ENTRY_MUTATION}
          />
        </Box>
        <Box>
          <EditableDatePicker
            id={_id}
            refName="endDate"
            defaultValue={new Date(endDate)}
            isClearable={true}
            showPopperArrow={true}
            mutationSchema={UPDATE_ENTRY_MUTATION}
          />
        </Box>
        <Box>
          <IconButton
            aria-label="show amounts"
            onClick={onToggle}
            icon={isOpen === true ? <ArrowUpIcon /> : <ArrowDownIcon />}
          />
        </Box>
      </Grid>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
        >
          Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
          deserunt aute id consequat veniam incididunt duis in sint irure nisi.
          Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor
          esse quis.
        </Box>
      </Collapse>
    </>
  )
}

const HeaderForEntries: FC = () => (
  <Grid templateColumns="repeat(7, 1fr)" m={2}>
    <Box>
      <Text>Name</Text>
    </Box>
    <Box>
      <Text>Type</Text>
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
    <Box>
      <Text>Expand</Text>
    </Box>
  </Grid>
)

const ListView: FC = () => {
  const { user } = useAuth()
  const entriesQuery = useQuery(GET_ENTRIES, {
    variables: {
      payload: {
        userId: user.uid,
      },
    },
  })

  return (
    <Box w="100%">
      <HeaderForEntries />
      {entriesQuery.data?.entries?.map((entry: IEntryInfo) => (
        <EntryInfo key={entry._id} {...entry} />
      ))}
    </Box>
  )
}

export default ListView
