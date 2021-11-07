import { FC } from 'react'
import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react'

interface StatWrapperProps {
  label: string
  value: number
  multiplier?: number
}
const StatWrapper: FC<StatWrapperProps> = ({ label, value, multiplier }) => {
  if (multiplier === undefined) {
    multiplier = 1
  }
  return (
    <Box w={{ base: '100%' }}>
      <Stat borderWidth={2} p={5}>
        <StatLabel fontWeight="bold">{label}</StatLabel>
        <StatNumber>
          {'$' +
            (value * multiplier).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
        </StatNumber>
      </Stat>
    </Box>
  )
}

export default StatWrapper
