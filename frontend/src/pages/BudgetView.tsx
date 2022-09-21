import { FC, useState } from 'react'
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'

import MonthView from './MonthView'
import InteractiveView from './InteractiveView'

import { MonthArray } from '../common/enums'
import YearView from './YearView'
import { AmountListItemContent } from '../components/amountlist/AmountListItemContent'
import useAggregatedLocalStorage from '../common/hooks/useAggregatedLocalStorage'
import AmountList from '../components/amountlist/AmountList'
import { DayAmountInfo } from '../common/types/DayAmountInfo'

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
          {name === 'Month' ? MonthArray[value] : value}
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

const dateIsSame = (someDate: Date, otherDate: Date) => {
  return (
    someDate.getDate() == otherDate.getDate() &&
    someDate.getMonth() == otherDate.getMonth() &&
    someDate.getFullYear() == otherDate.getFullYear()
  )
}

interface DateTrackedBudgetStoreType {
  date: Date
  data: AmountListItemContent[]
}

const localStorageKey = 'DateTrackedBudgetStorage'

const DataTabs: FC = () => {
  const [month, setMonth] = useState(dateToday.getMonth())
  const [year, setYear] = useState(dateToday.getFullYear())

  const [dayClickModalTitle, setDayClickModalTitle] = useState('')
  const [dayClickModalDate, setDayClickModalDate] = useState(dateToday)
  const [budgetDataForDay, setBudgetDataForDay] = useState<
    AmountListItemContent[]
  >([])
  const {
    isOpen: dayClickModalIsOpen,
    onOpen: openDayClickModal,
    onClose: closeDayClickModal,
  } = useDisclosure()
  const onDayClick = (date: Date) => {
    setDayClickModalTitle(date.toDateString())
    setDayClickModalDate(new Date(date))

    const budgetDataFoundInStorage = storedBudgets.find((budget) =>
      dateIsSame(new Date(budget.date), new Date(date))
    )
    setBudgetDataForDay(
      budgetDataFoundInStorage !== undefined
        ? budgetDataFoundInStorage.data
        : []
    )
    openDayClickModal()
  }

  const [storedBudgets, setStoredBudgets, setBudgetInStorage] =
    useAggregatedLocalStorage<DateTrackedBudgetStoreType>(
      localStorageKey,
      (data: DateTrackedBudgetStoreType) => new Date(data.date)
    )

  const [dayAmounts, setDayAmounts] = useState<DayAmountInfo[]>([])

  return (
    <Box width="95%" overflowX="scroll">
      <Tabs isManual align="center" defaultIndex={0} colorScheme="teal">
        <TabList>
          <Tab>Month View</Tab>
          <Tab>Year View</Tab>
          <Tab>Interactive View</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DataButtons name={'Month'} value={month} setValueFunc={setMonth} />
            <MonthView
              date={new Date(dateToday.setMonth(month))}
              onDayClick={onDayClick}
              dayAmounts={dayAmounts}
            />
          </TabPanel>
          <TabPanel>
            <DataButtons name={'Year'} value={year} setValueFunc={setYear} />
            <YearView
              year={year}
              onDayClick={onDayClick}
              dayAmounts={dayAmounts}
            />
          </TabPanel>
          <TabPanel>
            <InteractiveView />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        isOpen={dayClickModalIsOpen}
        onClose={closeDayClickModal}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{dayClickModalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {['Income', 'Expense'].map((type, key) => {
              return (
                <AmountList
                  key={key}
                  type={type}
                  budgetData={budgetDataForDay}
                  setBudgetData={setBudgetDataForDay}
                />
              )
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={closeDayClickModal}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const newBudget = {
                  date: dayClickModalDate,
                  data: budgetDataForDay,
                } as DateTrackedBudgetStoreType
                setBudgetInStorage(newBudget)

                console.log(storedBudgets)

                const newObj = {
                  date: dayClickModalDate,
                  income: budgetDataForDay
                    .filter((a) => a.type === 'Income')
                    .map((a) => a.amount),
                  expenses: budgetDataForDay
                    .filter((a) => a.type === 'Expense')
                    .map((a) => a.amount),
                } as DayAmountInfo
                setDayAmounts([
                  ...dayAmounts.filter(
                    (obj) =>
                      !dateIsSame(
                        new Date(obj.date),
                        new Date(dayClickModalDate)
                      )
                  ),
                  { ...newObj },
                ])

                closeDayClickModal()
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

const BudgetView: FC = () => {
  return <DataTabs />
}

export default BudgetView
