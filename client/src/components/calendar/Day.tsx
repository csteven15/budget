import { FC } from 'react'
import { Badge, Box, Text, useColorModeValue } from '@chakra-ui/react'

import { IAmountInfo } from '../../common/gql/Types'

interface IDayProps {
  date: Date
  month: number
  incomeAmounts: IAmountInfo[]
  expenseAmounts: IAmountInfo[]
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
      {incomeAmounts?.map((amountInfo: IAmountInfo) => (
        <Box key={amountInfo._id}>
          <Badge colorScheme="green">{amountInfo.amount}</Badge>
        </Box>
      ))}
      {expenseAmounts?.map((amountInfo: IAmountInfo) => (
        <Box key={amountInfo._id}>
          <Badge colorScheme="red">{amountInfo.amount}</Badge>
        </Box>
      ))}
    </Box>
  )
}

export default Day
