import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Input, Select, SimpleGrid, theme } from '@chakra-ui/react'
import { IEntry } from '../../common/types'
import { useAuth } from '../../context/AuthContext'
import {
  EFrequencyType,
  EFrequencyValues,
  EEntryValues,
} from '../../common/enums/index'
import DatePicker from './DatePicker'
import { useCreateEntryMutation } from '../../hooks/useEntryMutation'

const today = new Date()

interface IEntryFormProps {
  closePopover?: () => void
}

const EntryForm: FC<IEntryFormProps> = ({ closePopover }) => {
  const { user } = useAuth()

  const { register, errors, handleSubmit } = useForm<IEntry>()
  const [startDate, setStartDate] = useState(today)

  const { mutate } = useCreateEntryMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    mutate({
      payload: {
        userId: user.uid as string,
        name: formData!.name,
        type: parseInt(formData!.type, 10),
        budgetedAmount: parseFloat(formData!.budgetedAmount),
        frequency: parseInt(formData!.frequency, 10),
        startDate: new Date(startDate.setHours(0, 0, 0, 0)),
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
          placeholder="Name"
          ref={register({ required: true })}
          isInvalid={!!errors.budgetedAmount}
          errorBorderColor={theme.colors.red[300]}
        />
      </Box>
      <Box>
        <Select
          name="type"
          ref={register({ required: true })}
          defaultValue={0}
          placeholder="Input Type"
        >
          {EEntryValues.map((input) => (
            <option key={input.value} value={input.value}>
              {input.text}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Input
          name="budgetedAmount"
          placeholder="Budgeted Amount"
          ref={register({
            required: true,
            pattern: {
              value: /^\d+\.?\d*$/,
              message: 'Wrong format: E.g. 100.00',
            },
            min: { value: 0, message: 'No negative numbers' },
          })}
          isInvalid={!!errors.budgetedAmount}
          errorBorderColor={theme.colors.red[300]}
        />
      </Box>
      <Box>
        <Select
          name="frequency"
          ref={register({ required: true })}
          placeholder="Frequency"
          defaultValue={EFrequencyType.Once}
        >
          {EFrequencyValues.map((frequency) => (
            <option key={frequency.text} value={frequency.value}>
              {frequency.text}
            </option>
          ))}
        </Select>
      </Box>
      <Box my="2">
        <DatePicker
          selectedDate={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </Box>
      <Box></Box>
      <Box>
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          type="submit"
          variant="solid"
          boxShadow="md"
        >
          Add Entry
        </Button>
      </Box>
    </SimpleGrid>
  )
}

export default EntryForm
