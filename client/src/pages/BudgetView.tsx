import React, { FC, useState } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import MonthView from './MonthView'
import YearView from './YearView'

const dateToday = new Date()

interface DataButtonProps {
  name: string
  value: number
  setValueFunc: React.Dispatch<React.SetStateAction<number>>
}

const DataButtons: FC<DataButtonProps> = ({ name, value, setValueFunc }) => {
  return (
    <Flex>
      <Button colorScheme="blue" onClick={() => setValueFunc(value - 1)}>
        Previous {name}
      </Button>
      <Spacer />
      <Button colorScheme="blue" onClick={() => setValueFunc(value + 1)}>
        Next {name}
      </Button>
    </Flex>
  )
}

const DataTabs: FC = () => {
  const [year, setYear] = useState(dateToday.getFullYear())
  const [month, setMonth] = useState(dateToday.getMonth())
  return (
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
  )
}

const BudgetView: FC = () => {
  return <DataTabs />
}

export default BudgetView
