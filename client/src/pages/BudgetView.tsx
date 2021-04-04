import React, { FC, useState } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  IconButton,
  Spacer,
  Heading,
  Center,
  Box,
} from '@chakra-ui/react'
import MonthView from './MonthView'
import YearView from './YearView'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { MonthArray } from '../common/enums'

const dateToday = new Date()

interface DataButtonProps {
  name: string
  value: number
  setValueFunc: React.Dispatch<React.SetStateAction<number>>
}

const DataButtons: FC<DataButtonProps> = ({ name, value, setValueFunc }) => {
  return (
    <Flex>
      <IconButton
        onClick={() => setValueFunc(value - 1)}
        aria-label="prev"
        icon={<ArrowBackIcon />}
      />
      <Spacer />
      <Center>
        <Heading as="h6" fontSize="md">
          {name === 'month' ? MonthArray[value] : value}
        </Heading>
      </Center>
      <Spacer />
      <IconButton
        onClick={() => setValueFunc(value + 1)}
        aria-label="next"
        icon={<ArrowForwardIcon />}
      />
    </Flex>
  )
}

const DataTabs: FC = () => {
  const [year, setYear] = useState(dateToday.getFullYear())
  const [month, setMonth] = useState(dateToday.getMonth())
  return (
    <Box width="95%">
      <Tabs isManual align="center">
        <TabList>
          <Tab>Month View</Tab>
          <Tab>Year View</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DataButtons name={'Month'} value={month} setValueFunc={setMonth} />
            <MonthView date={new Date(dateToday.setMonth(month))} />
          </TabPanel>
          <TabPanel>
            <DataButtons name={'Year'} value={year} setValueFunc={setYear} />
            <YearView date={new Date(dateToday.setFullYear(year))} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

const BudgetView: FC = () => {
  return <DataTabs />
}

export default BudgetView
