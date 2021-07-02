import { FC } from 'react'
import { Badge, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

import { DayInfo, IAmountInfo } from '../../common/gql/Types'
import EditableTextField from '../forms/EditableTextField'
import {
  UPDATE_AMOUNT_MUTATION,
  UPDATE_ENTRY_MUTATION,
} from '../../common/gql/Mutations'

interface IDayProps {
  date: Date
  month: number
  incomeAmounts: DayInfo[]
  expenseAmounts: DayInfo[]
}

const Day: FC<IDayProps> = ({ date, month, incomeAmounts, expenseAmounts }) => {
  const monthColor = useColorModeValue('white', 'gray.800')
  const nonMonthColor = useColorModeValue('whitesmoke', 'gray.900')
  return (
    <Box
      borderWidth="1px"
      minW="50px"
      h="125px"
      backgroundColor={date.getMonth() === month ? monthColor : nonMonthColor}
    >
      <Text
        textAlign={['center', 'right', 'right', 'right']}
        fontSize={['sm', 'md', 'lg', 'xl']}
      >
        {date.getDate()}
      </Text>
      {incomeAmounts?.map((dayInfo: DayInfo) =>
        dayInfo.amounts.map((amountInfo: IAmountInfo) => (
          <Box key={amountInfo._id}>
            <Badge colorScheme="green">
              <Flex align="center">
                <Box textTransform="none">
                  <EditableTextField
                    refName="name"
                    id={amountInfo._id}
                    defaultValue={dayInfo.name}
                    mutationSchema={UPDATE_ENTRY_MUTATION}
                    type="string"
                    required
                  />
                </Box>
                <Text>{' - $'}</Text>
                <Box>
                  <EditableTextField
                    refName="amount"
                    id={amountInfo._id}
                    defaultValue={amountInfo.amount.toFixed(2)}
                    mutationSchema={UPDATE_AMOUNT_MUTATION}
                    type="float"
                    required
                  />
                </Box>
              </Flex>
            </Badge>
          </Box>
        ))
      )}
      {expenseAmounts?.map((dayInfo: DayInfo) =>
        dayInfo.amounts.map((amountInfo: IAmountInfo) => (
          <Box key={amountInfo._id}>
            <Badge colorScheme="red">
              <Flex align="center">
                <Box textTransform="none">
                  <EditableTextField
                    refName="name"
                    id={amountInfo._id}
                    defaultValue={dayInfo.name}
                    mutationSchema={UPDATE_ENTRY_MUTATION}
                    type="string"
                    required
                  />
                </Box>
                <Text>{' - $'}</Text>
                <Box>
                  <EditableTextField
                    refName="amount"
                    id={amountInfo._id}
                    defaultValue={amountInfo.amount.toFixed(2)}
                    mutationSchema={UPDATE_AMOUNT_MUTATION}
                    type="float"
                    required
                  />
                </Box>
              </Flex>
            </Badge>
          </Box>
        ))
      )}
    </Box>
  )
}

export default Day
