import React, { FC, useState } from 'react'
import { gql, useQuery } from '@apollo/client'

import { EInputType } from '../common/enums/index'
import { Box, Text } from '@chakra-ui/layout'
import { Grid, IconButton, Input, theme, useToast } from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Controller, RegisterOptions, useForm } from 'react-hook-form'

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
  refName: string
  defaultValue: number | string
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >
}

const HoverableTextField: FC<IHoverableTextField> = ({
  refName,
  defaultValue,
  rules,
}) => {
  const { errors, handleSubmit, control } = useForm()

  const [hover, setHover] = useState(false)

  const errorToast = useToast()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  console.log('errors', errors[refName])
  console.log(errors[refName]?.message)
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Controller
        control={control}
        name={refName}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, onBlur, value, ref }) => (
          <div>
            {hover || value !== defaultValue ? (
              <Input
                m={-2}
                variant="filled"
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                inputref={ref}
                isInvalid={errors[refName]}
                errorBorderColor={theme.colors.red[300]}
              />
            ) : (
              <Text>{value}</Text>
            )}
            {value !== defaultValue ? (
              <div>
                <IconButton
                  aria-label="reset"
                  icon={<CloseIcon />}
                  onClick={() => {
                    setHover(false)
                    onChange(defaultValue)
                  }}
                />
                <IconButton
                  aria-label="check"
                  type="submit"
                  icon={<CheckIcon />}
                  onClick={() => {
                    if (errors[refName]) {
                      errorToast({
                        description: errors[refName].message,
                        status: 'error',
                        duration: 3e3,
                        isClosable: true,
                      })
                    } else {
                      setHover(false)
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        )}
      />
    </form>
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
  console.log(name, budgetedAmount, createdAt, startDate, endDate)
  return (
    <Grid templateColumns="repeat(5, 1fr)" m={2}>
      <Box>
        <HoverableTextField refName="name" defaultValue={name} />
      </Box>
      <Box>
        <HoverableTextField
          refName="budgetedAmount"
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
