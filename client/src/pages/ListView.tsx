import React, { FC, useState } from 'react'
import { gql, useQuery } from '@apollo/client'

import { EInputType } from '../common/enums/index'
import { Box, Flex, Text } from '@chakra-ui/layout'
import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  IconButton,
  Input,
  useEditableControls,
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
  Control,
  Controller,
  FieldValues,
  useForm,
  UseFormMethods,
} from 'react-hook-form'

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

// interface IEditableTextFieldProp {
//   value: string | number
// }

// const EditableTextField: FC<IEditableTextFieldProp> = ({ value }) => {
//   const [hover, setHover] = useState(false)

//   const EditableControls = () => {
//     const {
//       isEditing,
//       getSubmitButtonProps,
//       getCancelButtonProps,
//     } = useEditableControls()

//     if (isEditing) {
//       return (
//         <ButtonGroup justifyContent="center" size="sm">
//           <IconButton
//             aria-label="Check"
//             icon={<CheckIcon />}
//             {...getSubmitButtonProps()}
//           />
//           <IconButton
//             aria-label="Close"
//             icon={<CloseIcon />}
//             {...getCancelButtonProps()}
//           />
//         </ButtonGroup>
//       )
//     }
//     return null
//   }

//   return (
//     <Box>
//       <Editable
//         textAlign="center"
//         defaultValue={value.toString()}
//         value={value.toString()}
//         onMouseEnter={() => setHover(true)}
//         onMouseLeave={() => setHover(false)}
//       >
//         <EditablePreview />
//         <EditableInput />
//         {hover ? <EditableControls /> : null}
//       </Editable>
//     </Box>
//   )
// }

interface IHoverableTextField {
  control: Control<FieldValues>
  refName: string
  defaultValue: string
}

const HoverableTextField: FC<IHoverableTextField> = ({
  control,
  refName,
  defaultValue,
}) => {
  const [hover, setHover] = useState(false)

  console.log('control', control)
  console.log('refname', refName)
  console.log('value', refName)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Controller
        control={control}
        name={refName}
        defaultValue={defaultValue}
        render={({ onChange, onBlur, value, ref }) => (
          <div>
            {hover ? (
              <Input
                variant="filled"
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                inputRef={ref}
              />
            ) : (
              <Text>{value}</Text>
            )}
            {value !== defaultValue ? (
              <Button onClick={() => onChange(defaultValue)}>reset</Button>
            ) : null}
          </div>
        )}
      />
    </div>
  )
}

// Fills whole width
const EntryInfo: FC<IEntryInfo> = ({
  name,
  budgetedAmount,
  createdAt,
  startDate,
  endDate,
}) => {
  const { register, handleSubmit, control } = useForm()
  console.log(name, budgetedAmount, createdAt, startDate, endDate)
  return (
    <Grid templateColumns="repeat(5, 1fr)">
      <Box>
        <HoverableTextField
          control={control}
          refName="name"
          defaultValue={name}
        />
      </Box>
      <Box>{budgetedAmount}</Box>
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
