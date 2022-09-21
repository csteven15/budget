import { FC, useState, useEffect, useRef } from 'react'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  Grid,
  GridItem,
  Input,
  Stack,
  StackProps,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react'
import { PieChart } from 'react-minimal-pie-chart'

import AmountList from '../components/amountlist/AmountList'
import StatWrapper from '../components/amountlist/StatWrapper'
import useAggregatedLocalStorage from '../common/hooks/useAggregatedLocalStorage'
import { AmountListItemContent } from '../components/amountlist/AmountListItemContent'

const getRandomColor = () =>
  '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)

interface PieChartData {
  title: string
  value: number
  color: string
}

const stackProps: StackProps = {
  spacing: 4,
  direction: { base: 'column', lg: 'row' },
  align: 'center',
}

const getSumFor = (type: string, data: AmountListItemContent[]) => {
  return data
    .filter((entry) => entry.type == type && entry.applied)
    .reduce((sum, current) => sum + current.amount, 0)
}

const getPieChartDataFor = (data: AmountListItemContent[]) => {
  const incomeTotal = getSumFor('Income', data)
  let pieChartData: PieChartData[] = []
  data
    .filter((entry) => entry.type == 'Expense')
    .forEach((entry) => {
      if (entry.amount > 0 && entry.applied && incomeTotal > 0) {
        const percentageOfIncome = (entry.amount / incomeTotal) * 100
        pieChartData = [
          ...pieChartData,
          {
            title: entry.name,
            value: percentageOfIncome,
            color: getRandomColor(),
          },
        ]
      }
    })
  return pieChartData
}

interface BudgetStoreType {
  name: string
  data: AmountListItemContent[]
}

const localStorageMainKey = 'InteractiveView'
const defaultBudgetName = 'My Budget'

const InteractiveView: FC = () => {
  const [firstRender, setFirstRender] = useState(true)
  const [totalInBank, setTotalInBank] = useState(0)
  const [netIncome, setNetIncome] = useState(0)
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [expenseTotal, setExpenseTotal] = useState(0)
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([])

  const [budgetData, setBudgetData] = useState<Array<AmountListItemContent>>([])
  const [budgetName, setBudgetName] = useState(defaultBudgetName)

  const {
    isOpen: alertIsOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()
  const cancelRef = useRef<any>()

  const {
    isOpen: loadDrawerIsOpen,
    onOpen: onLoadDrawerOpen,
    onClose: onLoadDrawerClose,
  } = useDisclosure()

  const [storedBudgets, setStoredBudgets, setBudgetInStorage] =
    useAggregatedLocalStorage<BudgetStoreType>(
      localStorageMainKey,
      (data: BudgetStoreType) => data.name
    )

  useEffect(() => {
    const defaultStoredBudget = storedBudgets.find(
      (data) => data.name === defaultBudgetName
    )
    if (defaultStoredBudget != undefined) {
      setBudgetData(defaultStoredBudget.data)
      setPieChartData(getPieChartDataFor(budgetData))
    }
  }, [])

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
      return
    }

    budgetData.sort((a, b) => 0 - (a.amount > b.amount ? 1 : -1))

    setIncomeTotal(getSumFor('Income', budgetData))
    setExpenseTotal(getSumFor('Expense', budgetData))
    setTotalInBank(getSumFor('Bank Account', budgetData))

    setPieChartData(getPieChartDataFor(budgetData))
    setBudgetInStorage({ name: budgetName, data: budgetData })
  }, [budgetData])

  useEffect(() => {
    setNetIncome(incomeTotal - expenseTotal)
  }, [incomeTotal, expenseTotal])

  const RenderTotalStat = (label: string, mutliplier?: number) => {
    return (
      <StatWrapper
        label={label}
        initialValue={totalInBank}
        value={netIncome}
        multiplier={mutliplier}
      />
    )
  }

  return (
    <VStack divider={<StackDivider />} spacing={4} align="stretch">
      <Grid templateColumns="repeat(5, 1fr)" gap={1}>
        <GridItem colSpan={4}>
          <Input
            placeholder="Enter Budget Name"
            value={budgetName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBudgetName(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && budgetName !== defaultBudgetName) {
                onAlertOpen()
              }
            }}
          />
          <AlertDialog
            onClose={onAlertClose}
            isOpen={alertIsOpen}
            leastDestructiveRef={cancelRef}
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Create New Budget?</AlertDialogHeader>
              <AlertDialogBody></AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertClose}>
                  No
                </Button>
                <Button
                  colorScheme="teal"
                  ml={3}
                  onClick={() => {
                    setBudgetData([])
                  }}
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </GridItem>
        <GridItem colSpan={1}>
          <Button colorScheme="teal" onClick={onLoadDrawerOpen}>
            Load
          </Button>
          <Drawer
            isOpen={loadDrawerIsOpen}
            placement="right"
            onClose={onLoadDrawerClose}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Saved Budgets</DrawerHeader>
              <DrawerBody>
                <VStack>
                  {storedBudgets.map(({ name, data }, key) => (
                    <Button
                      key={key}
                      variant="link"
                      onClick={() => {
                        setBudgetName(name)
                        setBudgetData(data)
                      }}
                    >
                      {name}
                    </Button>
                  ))}
                </VStack>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onLoadDrawerClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={() => setStoredBudgets([])}>
                  Delete All
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </GridItem>
      </Grid>
      {['Bank Account', 'Income', 'Expense'].map((type, key) => {
        return (
          <AmountList
            key={key}
            type={type}
            budgetData={budgetData}
            setBudgetData={setBudgetData}
          />
        )
      })}
      <>
        <Text align="left" fontWeight="bold">
          Net Income
        </Text>
        <Stack {...stackProps}>
          <StatWrapper label="Income Total" value={incomeTotal} />
          <Text fontWeight="bold">-</Text>
          <StatWrapper label="Expense Total" value={expenseTotal} />
          <Text fontWeight="bold">=</Text>
          <StatWrapper label="Net Income" value={netIncome} />
        </Stack>
      </>
      <>
        <Text align="left" fontWeight="bold">
          Stats
        </Text>
        <Stack {...stackProps}>
          {RenderTotalStat('End of Month Total')}
          {RenderTotalStat('End of Year Total', 12)}
          {RenderTotalStat('End of 5 Year Total', 12 * 5)}
          {RenderTotalStat('End of 10 Year Total', 12 * 10)}
        </Stack>
        <PieChart
          animate
          data={pieChartData}
          label={({ dataEntry }) =>
            dataEntry.title + ': ' + Math.round(dataEntry.percentage) + '%'
          }
          labelStyle={{
            fontSize: '2.5px',
            fill:
              localStorage.getItem('chakra-ui-color-mode') == 'dark'
                ? '#fff'
                : '#000',
          }}
          labelPosition={110}
          lineWidth={40}
          radius={25}
        />
      </>
    </VStack>
  )
}

export default InteractiveView
