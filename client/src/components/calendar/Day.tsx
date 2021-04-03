import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'
import { IAmountInfo } from '../../common/gql/Types'

interface IDayProps {
  date: Date
  incomeAmounts: IAmountInfo[]
  expenseAmounts: IAmountInfo[]
}

const Day: FC<IDayProps> = ({ date, incomeAmounts, expenseAmounts }) => (
  <Box borderWidth="1px" minW="50px" h="125px">
    <Box textAlign="right">{date.getDate()}</Box>
    {incomeAmounts?.map((amountInfo: IAmountInfo) => (
      <Box key={amountInfo._id} textAlign="center">
        + {amountInfo.amount}
      </Box>
    ))}
    {expenseAmounts?.map((amountInfo: IAmountInfo) => (
      <Box key={amountInfo._id} textAlign="center">
        - {amountInfo.amount}
      </Box>
    ))}
  </Box>
)

export default Day
