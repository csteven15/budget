import React, { FC } from 'react'
import { useMutation, useQuery } from '@apollo/client'
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
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  DELETE_AMOUNT_MUTATION,
  UPDATE_AMOUNT_MUTATION,
  UPDATE_ENTRY_MUTATION,
} from '../common/gql/Mutations'
import EditableSelect from '../components/forms/EditableSelect'
import { EEntryValues } from '../common/enums'
import EditableCheckbox from '../components/forms/EditableCheckbox'
import { IAmountInfo, IEntryInfo } from '../common/gql/Types'
import { GET_ENTRIES } from '../common/gql/Queries'

const AmountInfo: FC<IAmountInfo> = ({ _id, amount, date, paid }) => {
  const [deleteAmount] = useMutation<FormData>(DELETE_AMOUNT_MUTATION)
  return (
    <Grid templateColumns="repeat(4, 1fr)" m={2}>
      <Box>
        <EditableTextField
          refName="amount"
          id={_id}
          defaultValue={amount}
          mutationSchema={UPDATE_AMOUNT_MUTATION}
          type="float"
          required
        />
      </Box>
      <Box>
        <EditableDatePicker
          id={_id}
          refName="date"
          defaultValue={new Date(date)}
          isClearable={true}
          showPopperArrow={true}
          mutationSchema={UPDATE_AMOUNT_MUTATION}
        />
      </Box>
      <Box>
        <EditableCheckbox
          id={_id}
          refName="paid"
          defaultValue={paid}
          mutationSchema={UPDATE_AMOUNT_MUTATION}
        />
      </Box>
      <Box>
        <IconButton
          onClick={() => deleteAmount({ variables: { _id: _id } })}
          icon={<DeleteIcon />}
          aria-label="delete amount"
        />
      </Box>
    </Grid>
  )
}

const AccountHeader: FC = () => (
  <Grid templateColumns="repeat(4, 1fr)" m={2}>
    <Box>
      <Text>Amount</Text>
    </Box>
    <Box>
      <Text>Date</Text>
    </Box>
    <Box>
      <Text>Paid</Text>
    </Box>
    <Box>
      <Text>Delete</Text>
    </Box>
  </Grid>
)

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
            mutationSchema={UPDATE_ENTRY_MUTATION}
            type="string"
            required
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
            mutationSchema={UPDATE_ENTRY_MUTATION}
            type="float"
            required
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
        {amounts?.length > 0 ? (
          <Box>
            <IconButton
              aria-label="show amounts"
              onClick={onToggle}
              icon={isOpen === true ? <ArrowUpIcon /> : <ArrowDownIcon />}
            />
          </Box>
        ) : null}
      </Grid>
      <Collapse in={isOpen} animateOpacity>
        <Box m="2" bg="white" rounded="md" boxShadow="md">
          <AccountHeader />
          {amounts?.map((amount) => (
            <AmountInfo
              key={amount._id}
              _id={amount?._id as string}
              {...amount}
            />
          ))}
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
  const { data, loading } = useQuery(GET_ENTRIES, {
    variables: {
      payload: {
        userId: user.uid,
      },
    },
  })

  if (loading) {
    return <p>loading</p>
  }

  return (
    <Box w="100%">
      <HeaderForEntries />
      {data?.entries?.map((entry: IEntryInfo) => (
        <EntryInfo key={entry._id} {...entry} />
      ))}
    </Box>
  )
}

export default ListView
