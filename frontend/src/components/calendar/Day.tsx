import { FC } from 'react'
import { Badge, Box, Text, useColorModeValue, VStack } from '@chakra-ui/react'

interface IDayProps {
  date: Date
  month: number
  incomeTotal: number
  expenseTotal: number
  runningBalance: number
  onClick: (date: Date) => void
}

const isToday = (someDate: Date) => {
  const today = new Date()
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  )
}

const Day: FC<IDayProps> = ({
  date,
  month,
  incomeTotal,
  expenseTotal,
  runningBalance,
  onClick,
}) => {
  const monthColor = useColorModeValue('white', 'gray.800')
  const nonMonthColor = useColorModeValue('whitesmoke', 'gray.900')
  const getBackgroundColorForDay = (dateOfDay: Date) => {
    if (isToday(dateOfDay)) return useColorModeValue('teal.200', 'teal')
    return dateOfDay.getMonth() === month ? monthColor : nonMonthColor
  }

  return (
    <Box
      borderWidth="1px"
      minW="50px"
      h="125px"
      backgroundColor={getBackgroundColorForDay(date)}
      onClick={() => onClick(date)}
    >
      <Text
        textAlign={['center', 'right', 'right', 'right']}
        fontSize={['sm', 'md', 'lg', 'xl']}
      >
        {date.getDate()}
      </Text>
      <VStack>
        {incomeTotal > 0 ? (
          <Badge colorScheme="green">{'+$' + incomeTotal}</Badge>
        ) : null}
        {expenseTotal > 0 ? (
          <Badge colorScheme="red">{'-$' + expenseTotal}</Badge>
        ) : null}
        {/* <Badge colorScheme="teal">{'$' + runningBalance}</Badge> */}
      </VStack>
    </Box>
  )
}

export default Day
