import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spacer,
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
import { EEntryType, EEntryValues } from '../common/enums'
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
  amounts,
}) => {
  const localCreatedAt = new Date(createdAt)
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box rounded="md" boxShadow="md">
      <Grid templateRows="repeat(3, 1fr)" m={2}>
        <GridItem rowSpan={1}>
          <Flex fontWeight="bold" fontSize="lg">
            <EditableTextField
              refName="name"
              id={_id}
              defaultValue={name}
              mutationSchema={UPDATE_ENTRY_MUTATION}
              type="string"
              required
            />
            <Spacer />
            {amounts?.length > 0 ? (
              <Button size="xs" onClick={onToggle}>
                {isOpen === true ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </Button>
            ) : null}
          </Flex>
        </GridItem>
        <GridItem rowSpan={1}>
          <Flex fontWeight="medium">
            <Text>$</Text>
            &nbsp;
            <EditableTextField
              refName="budgetedAmount"
              id={_id}
              defaultValue={budgetedAmount.toFixed(2)}
              mutationSchema={UPDATE_ENTRY_MUTATION}
              type="float"
              required
            />
          </Flex>
        </GridItem>
        <GridItem rowSpan={1}>
          <Flex>
            <Badge color={type === EEntryType.Income ? 'blue' : 'red'}>
              <Box>
                <EditableSelect
                  refName="type"
                  id={_id}
                  defaultValue={type}
                  mutationSchema={UPDATE_ENTRY_MUTATION}
                  textToValueMapping={EEntryValues}
                />
              </Box>
            </Badge>
            <Spacer />
            <Flex>
              <Text>{localCreatedAt.toLocaleDateString()}</Text>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      <Collapse in={isOpen} animateOpacity>
        <Box m="2" bg="white" rounded="md" boxShadow="md">
          <Divider />
          <AccountHeader />
          {amounts?.map((amount) => (
            <AmountInfo key={amount._id} {...amount} />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}

const EntryFormPopoverContent: FC<{ closePopover?: () => void }> = ({
  closePopover,
}) => (
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
        <EntryForm refetchQuery={true} closePopover={closePopover} />
      </Container>
    </PopoverBody>
  </PopoverContent>
)

const ListView: FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { data, loading } = useEntriesQueryCached()

  const openPopover = () => setPopoverOpen(true)
  const closePopover = () => setPopoverOpen(false)

  if (loading) {
    return <p>loading</p>
  }

  return (
    <Box w="95%">
      <Center mt="3">
        <Heading as="h6" size="md">
          Entries
        </Heading>
      </Center>
      <Flex my="3">
        <Popover
          isLazy
          isOpen={popoverOpen}
          onClose={closePopover}
          placement="bottom-end"
        >
          <PopoverTrigger>
            <Button
              onClick={openPopover}
              rounded="md"
              boxShadow="md"
              padding="2"
            >
              <Text size="md">
                Add Entry <EditIcon />
              </Text>
            </Button>
          </PopoverTrigger>
          <EntryFormPopoverContent {...closePopover} />
        </Popover>
      </Flex>
      {data?.entries?.map((entry: IEntryInfo) => (
        <EntryInfo key={entry._id} {...entry} />
      ))}
    </Box>
  )
}

export default ListView
