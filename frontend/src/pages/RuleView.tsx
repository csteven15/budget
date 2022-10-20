import { AddIcon, CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Center,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'

interface RowData {
  name: string
  category: string
  amount: string
}

const defaultRowData: RowData = {
  name: '',
  category: '',
  amount: '0',
}

const categories = ['', 'Need', 'Want', 'Savings']

function postRuleExpenseRowData(rows: RowData[]) {
  console.log('posting: ', rows)
  fetch('/postRuleExpenseRowData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rows),
  })
}

const accumulateSum = (container: RowData[]) => {
  return container.reduce((sum, current) => sum + parseFloat(current.amount), 0)
}

const RuleView: FC = () => {
  const [rows, setRows] = useState<RowData[]>([])
  const [activeRowIndex, setActiveRowIndex] = useState(-1)

  const [income, setIncome] = useState(0)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')

  const getPercentageOfCategory = (category: string) => {
    const expense = accumulateSum(rows.filter((e) => e.category === category))
    if (income === 0 || expense > income) return 0
    return (expense / income) * 100
  }

  const expenses = rows.reduce(
    (sum, current) => sum + parseFloat(current.amount),
    0
  )
  const needPercentage = getPercentageOfCategory('Need')
  const wantPercentage = getPercentageOfCategory('Want')
  const savingsPercentage =
    income === 0 ? 0 : 100.0 - (needPercentage + wantPercentage)

  useEffect(() => {
    fetch('/fetchRuleExpenseRowData')
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.log('error:', err))
  }, [])

  console.log(rows)

  const saveRowData = () => {
    if (name === '' || category === '' || amount === '') return
    const parsed = parseFloat(amount)
    if (isNaN(parsed)) return
    const temp = rows
    temp[activeRowIndex] = {
      name: name,
      category: category,
      amount: parsed.toFixed(2).toString(),
    }
    setRows(temp)
    setActiveRowIndex(-1)
    postRuleExpenseRowData(rows)
  }

  const saveRowDataOnKeyDown = (e: React.KeyboardEvent<unknown>) => {
    if (e.key === 'Enter') saveRowData()
  }

  return (
    <div>
      <Center>
        <HStack>
          <Box>
            <Text>Monthly Net Income:</Text>
          </Box>
          <Box>
            <NumberInput
              onChange={(s) => {
                const temp = parseFloat(s)
                if (isNaN(temp)) return
                setIncome(temp)
              }}
              value={income}
              min={0}
              precision={2}
            >
              <NumberInputField />
            </NumberInput>
          </Box>
        </HStack>
      </Center>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Expense Name</Th>
              <Th>Category</Th>
              <Th>Amount</Th>
              <Th>
                <IconButton
                  colorScheme="teal"
                  aria-label="add"
                  icon={<AddIcon />}
                  onClick={() => {
                    setName('')
                    setCategory('')
                    setAmount('')
                    setRows([...rows, defaultRowData])
                    setActiveRowIndex(rows.length)
                  }}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((data, key) => {
              const isActive = key === activeRowIndex
              return (
                <Tr key={key}>
                  <Th>
                    {isActive ? (
                      <Input
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={saveRowDataOnKeyDown}
                        value={name}
                      />
                    ) : (
                      <Text>{data.name}</Text>
                    )}
                  </Th>
                  <Th>
                    {isActive ? (
                      <Select
                        onChange={(e) => setCategory(e.target.value)}
                        onKeyDown={saveRowDataOnKeyDown}
                        value={category}
                      >
                        {categories.map((type, key) => {
                          return <option key={key}>{type}</option>
                        })}
                      </Select>
                    ) : (
                      <Text>{data.category}</Text>
                    )}
                  </Th>
                  <Th>
                    {isActive ? (
                      <NumberInput
                        onChange={(e) => setAmount(e)}
                        onKeyDown={saveRowDataOnKeyDown}
                        value={amount}
                        min={0}
                      >
                        <NumberInputField />
                      </NumberInput>
                    ) : (
                      <Text>{'$' + data.amount}</Text>
                    )}
                  </Th>
                  <Th>
                    <HStack>
                      {isActive ? (
                        <IconButton
                          colorScheme="teal"
                          aria-label="save"
                          icon={<CheckIcon />}
                          onClick={saveRowData}
                        />
                      ) : (
                        <IconButton
                          colorScheme="teal"
                          aria-label="edit"
                          icon={<EditIcon />}
                          onClick={() => {
                            setName(data.name)
                            setCategory(data.category)
                            setAmount(data.amount)
                            setActiveRowIndex(key)
                          }}
                        />
                      )}
                      <IconButton
                        colorScheme="teal"
                        aria-label="delete"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          const temp = [...rows]
                          temp.splice(key, 1)
                          setRows(temp)
                          setActiveRowIndex(-1)
                          postRuleExpenseRowData(temp)
                        }}
                      />
                    </HStack>
                  </Th>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid
        templateRows="repeat(3), 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={2}
        color="white.700"
        fontWeight="bold"
        alignItems="center"
        bg="gray.500"
      >
        <GridItem rowSpan={3}>
          <Text>Income:</Text>
          <Text>$&nbsp;{income}</Text>
        </GridItem>
        <GridItem rowSpan={3}>
          <Text>Expenses:</Text>
          <Text>$&nbsp;{expenses}</Text>
        </GridItem>
        <GridItem rowSpan={3}>
          <Text>Net:</Text>
          <Text>$&nbsp;{income - expenses}</Text>
        </GridItem>
      </Grid>
      <Center paddingLeft="15%" paddingRight="15%">
        <Table>
          <Thead>
            <Tr>
              <Th>Rules</Th>
              <Th>Need</Th>
              <Th>Want</Th>
              <Th>Savings</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>Actual</Th>
              <Th>{needPercentage.toFixed()}%</Th>
              <Th>{wantPercentage.toFixed()}%</Th>
              <Th>{savingsPercentage.toFixed()}%</Th>
            </Tr>
            <Tr>
              <Th>50/30/20 Rule</Th>
              <Th>50%</Th>
              <Th>30%</Th>
              <Th>20%</Th>
            </Tr>
            <Tr>
              <Th>60/30/10 Rule</Th>
              <Th>30%</Th>
              <Th>10%</Th>
              <Th>60%</Th>
            </Tr>
          </Tbody>
        </Table>
      </Center>
    </div>
  )
}
export default RuleView
