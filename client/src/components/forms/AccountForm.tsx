import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { IAccount } from '../../common/types'
import { useAuth } from '../../context/AuthContext'
import { EAccountValues } from '../../common/enums'
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  theme,
} from '@chakra-ui/react'
import { useCreateAccountMutation } from '../../hooks/useAccountMutation'

interface IAccountFormProps {
  closePopover?: () => void
}

const AccountForm: FC<IAccountFormProps> = ({ closePopover }) => {
  const { user } = useAuth()

  const { register, errors, handleSubmit } = useForm<IAccount>()

  const { mutate } = useCreateAccountMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    mutate({
      payload: {
        userId: user.uid as string,
        name: formData.name,
        type: parseInt(formData.type, 10),
        total: parseFloat(formData.total),
        appliedToBudget: formData.appliedToBudget,
      },
    })
    if (closePopover) closePopover()
  }

  const onError = () => {
    console.log('error')
  }

  return (
    <SimpleGrid columns={2} spacing={3}>
      <Box>
        <Input
          name="name"
          placeholder="Account Name"
          ref={register({ required: true })}
          isInvalid={!!errors.name}
          errorBorderColor={theme.colors.red[300]}
        />
      </Box>
      <Box>
        <Select
          name="type"
          ref={register({ required: true })}
          defaultValue={0}
          placeholder="Acount Type"
        >
          {EAccountValues.map((type) => (
            <option key={type.value} value={type.value}>
              {type.text}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Input
          name="total"
          placeholder="Account Total"
          ref={register({
            required: true,
            pattern: {
              value: /^\d+\.?\d*$/,
              message: 'Wrong format: E.g. 100.00',
            },
            min: 0,
          })}
          isInvalid={!!errors.total}
          errorBorderColor={theme.colors.red[300]}
        />
      </Box>
      <Center>
        <Flex>
          <Text>Applied to Budget</Text>
          &nbsp; &nbsp;
          <Checkbox
            name="appliedToBudget"
            ref={register}
            defaultValue={0}
            defaultChecked={false}
          />
        </Flex>
      </Center>
      <Box>
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          ref={register}
          type="submit"
          variant="solid"
          boxShadow="md"
        >
          Add Account
        </Button>
      </Box>
    </SimpleGrid>
  )
}

export default AccountForm
