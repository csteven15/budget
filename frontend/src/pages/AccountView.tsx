import { FC, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
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
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

import AccountForm from '../components/forms/AccountForm'
import EditableTextField from '../components/forms/EditableTextField'
import EditableCheckbox from '../components/forms/EditableCheckbox'
import EditableSelect from '../components/forms/EditableSelect'

import { EAccountType, EAccountValues } from '../common/enums'
import { UPDATE_ACCOUNT_MUTATION } from '../common/gql/Mutations'
import { IAccountInfo } from '../common/gql/Types'
import { useMutation, useQuery } from 'react-query'

// eslint-disable-next-line
const AccountInfo: FC<IAccountInfo> = ({
  _id,
  name,
  total,
  type,
  appliedToBudget,
}) => {
  const { mutate } = useMutation({})
  const accountBadgeColorScheme = () => {
    if (type === EAccountType.Checking) return 'blue'
    if (type === EAccountType.Investment) return 'green'
    if (type === EAccountType.Retirement) return 'orange'
    if (type === EAccountType.Savings) return 'yellow'
    return 'red'
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
              mutationSchema={UPDATE_ACCOUNT_MUTATION}
              type="string"
              required
            />
            <Spacer />
            <IconButton
              onClick={() => mutate()}
              icon={<DeleteIcon color="red" />}
              aria-label="delete account"
              size="xs"
            />
          </Flex>
        </GridItem>
        <GridItem rowSpan={1}>
          <Flex fontWeight="medium">
            <Text>$</Text>
            <EditableTextField
              refName="total"
              id={_id}
              defaultValue={total.toFixed(2)}
              mutationSchema={UPDATE_ACCOUNT_MUTATION}
              type="float"
              required
            />
          </Flex>
        </GridItem>
        <GridItem rowSpan={1}>
          <Flex>
            <Badge colorScheme={accountBadgeColorScheme()}>
              <EditableSelect
                refName="type"
                id={_id}
                defaultValue={EAccountValues[type].value}
                mutationSchema={UPDATE_ACCOUNT_MUTATION}
                textToValueMapping={EAccountValues}
              />
            </Badge>
            <Spacer />
            <Text>Applied? &nbsp;</Text>
            <EditableCheckbox
              id={_id}
              refName="appliedToBudget"
              defaultValue={appliedToBudget}
              mutationSchema={UPDATE_ACCOUNT_MUTATION}
            />
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  )
}

const AccountFormPopoverContent: FC<{ closePopover?: () => void }> = ({
  closePopover,
}) => (
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverBody>
      <Container maxW="container.md" boxShadow="base" p="6" rounded="md">
        <AccountForm closePopover={closePopover} />
      </Container>
    </PopoverBody>
  </PopoverContent>
)

const AccountView: FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { data, isLoading } = useQuery({})

  const openPopover = () => setPopoverOpen(true)
  const closePopover = () => setPopoverOpen(false)

  const AccountCards: FC = () => {
    if (isLoading) return <Progress size="sm" isIndeterminate />
    if (data === undefined) return null
    return null
  }

  return (
    <Stack width="100%" px="1">
      {/* Total applied to budget */}
      {/* {'Total Applied to Budget: ' + getTotalAppliedToBudget()} */}
      <Center mt="3">
        <Heading as="h6" size="md">
          Accounts
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
                Add Account <EditIcon />
              </Text>
            </Button>
          </PopoverTrigger>
          <AccountFormPopoverContent closePopover={closePopover} />
        </Popover>
      </Flex>
      <AccountCards />
    </Stack>
  )
}

export default AccountView
