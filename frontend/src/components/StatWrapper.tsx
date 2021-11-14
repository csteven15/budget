import { FC } from 'react'
import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react'

interface StatWrapperProps {
  label: string
  value: number
  initialValue?: number
  multiplier?: number
}
const StatWrapper: FC<StatWrapperProps> = ({
  label,
  initialValue,
  value,
  multiplier,
}) => {
  if (multiplier === undefined) {
    multiplier = 1
  }
  if (initialValue === undefined) {
    initialValue = 0
  }
  return (
    <Box w={{ base: '100%' }}>
      <Stat borderWidth={2} p={5}>
        <StatLabel fontWeight="bold">{label}</StatLabel>
        <StatNumber>
          {'$' +
            (initialValue + value * multiplier).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
        </StatNumber>
      </Stat>
    </Box>
  )
}

export default StatWrapper
