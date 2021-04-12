import { FC, useState } from 'react'
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
  Progress,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons'
import EditableDatePicker from '../components/forms/EditableDatePicker'
import EditableTextField from '../components/forms/EditableTextField'
import EditableSelect from '../components/forms/EditableSelect'
import EditableCheckbox from '../components/forms/EditableCheckbox'
import EntryForm from '../components/forms/EntryForm'
import { useEntryQuery } from '../hooks/useEntryQuery'
import { useDeleteAmountMutation } from '../hooks/useAmountMutation'
import { useDeleteEntryMutation } from '../hooks/useEntryMutation'

import {
  UPDATE_AMOUNT_MUTATION,
  UPDATE_ENTRY_MUTATION,
} from '../common/gql/Mutations'
import { EEntryType, EEntryValues } from '../common/enums'
import { IAmountInfo, IEntryInfo } from '../common/gql/Types'

const AmountInfo: FC<IAmountInfo> = ({ _id, amount, date, paid }) => {
  const { mutate } = useDeleteAmountMutation()
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
          onClick={() => mutate({ _id: _id })}
          icon={<DeleteIcon color="red" />}
          aria-label="delete amount"
        />
      </Box>
    </Grid>
  )
}

const AmountHeader: FC = () => (
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
  const { mutate } = useDeleteEntryMutation()

  const DeleteButton: FC = () => (
    <IconButton
      onClick={() => mutate({ _id: _id })}
      icon={<DeleteIcon color="red" />}
      aria-label="delete entry"
      size="xs"
    />
  )

  const ActionButtons: FC = () => {
    if (amounts === undefined || amounts?.length === 0) return <DeleteButton />
    return (
      <>
        <Button size="xs" onClick={onToggle}>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Button>
        &nbsp;
        <DeleteButton />
      </>
    )
  }

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
            <ActionButtons />
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
            <Badge colorScheme={type === EEntryType.Income ? 'green' : 'red'}>
              <EditableSelect
                refName="type"
                id={_id}
                defaultValue={type}
                mutationSchema={UPDATE_ENTRY_MUTATION}
                textToValueMapping={EEntryValues}
              />
            </Badge>
            <Spacer />
            <Flex>
              <Text>{localCreatedAt.toLocaleDateString()}</Text>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      <Collapse in={isOpen} animateOpacity>
        <Box m="2" rounded="md" boxShadow="md" p="1">
          <Divider />
          <AmountHeader />
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
      <Container maxW="container.md" boxShadow="base" p="6" rounded="md">
        <EntryForm closePopover={closePopover} />
      </Container>
    </PopoverBody>
  </PopoverContent>
)

const ListView: FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { data, isLoading } = useEntryQuery()

  const openPopover = () => setPopoverOpen(true)
  const closePopover = () => setPopoverOpen(false)

  const EntryCards: FC = () => {
    if (isLoading) return <Progress size="sm" isIndeterminate />
    if (data === undefined) return null
    if (data?.entries?.length === 0) return <Text>No Entries</Text>
    return data?.entries?.map((entry: IEntryInfo) => (
      <EntryInfo key={entry._id} {...entry} />
    ))
  }

  return (
    <Stack w="100%" px="1">
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
          <EntryFormPopoverContent closePopover={closePopover} />
        </Popover>
      </Flex>
      <EntryCards />
    </Stack>
  )
}

export default ListView
