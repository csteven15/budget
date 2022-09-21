import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { EMonth } from '../common/enums'
import { DayAmountInfo } from '../common/types/DayAmountInfo'
import MonthView from './MonthView'

interface YearViewProps {
  year: number
  onDayClick: (date: Date) => void
  dayAmounts: DayAmountInfo[]
}

const YearView: FC<YearViewProps> = ({ year, onDayClick, dayAmounts }) => {
  return (
    <SimpleGrid minChildWidth="500px" spacing={10}>
      {Object.keys(EMonth).map((key: string) => {
        if (isNaN(parseInt(key))) return
        return (
          <Box key={key}>
            <Text fontWeight="bold">{EMonth[parseInt(key)]}</Text>
            <MonthView
              date={new Date(year, parseInt(key))}
              onDayClick={onDayClick}
              dayAmounts={dayAmounts}
            />
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export default YearView
