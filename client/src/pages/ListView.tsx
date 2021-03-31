import React, { FC } from 'react'
import { useMutation } from '@apollo/client'
import {
  Box,
  Collapse,
  Container,
  Flex,
  Grid,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import EditableDatePicker from '../components/forms/EditableDatePicker'
import EditableTextField from '../components/forms/EditableTextField'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons'
import {
  DELETE_AMOUNT_MUTATION,
  UPDATE_AMOUNT_MUTATION,
  UPDATE_ENTRY_MUTATION,
} from '../common/gql/Mutations'
import EditableSelect from '../components/forms/EditableSelect'
import { EEntryValues } from '../common/enums'
import EditableCheckbox from '../components/forms/EditableCheckbox'
import { IAmountInfo, IEntryInfo } from '../common/gql/Types'
import EntryForm from '../components/forms/EntryForm'
import { useEntriesQueryCached } from '../hooks/useEntriesQuery'

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

const EntryFormPopoverContent: FC = () => (
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverBody>
      <Container
        maxW="container.md"
        boxShadow="base"
        p="6"
        rounded="md"
        bg="white"
      >
        <EntryForm refetchQuery={true} />
      </Container>
    </PopoverBody>
  </PopoverContent>
)

const ListView: FC = () => {
  const { data, loading } = useEntriesQueryCached()

  if (loading) {
    return <p>loading</p>
  }

  return (
    <Box w="95%" rounded="md" boxShadow="md" mx="auto">
      <Flex>
        <Text size="md">Add Entry</Text>
        &nbsp;&nbsp;
        <Popover isLazy placement="bottom-end">
          <PopoverTrigger>
            <IconButton aria-label="Add Entry" size="sm" icon={<EditIcon />} />
          </PopoverTrigger>
          <EntryFormPopoverContent />
        </Popover>
      </Flex>

      <HeaderForEntries />
      {data?.entries?.map((entry: IEntryInfo) => (
        <EntryInfo key={entry._id} {...entry} />
      ))}
    </Box>
  )
}

export default ListView
