import React, { FC, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Text, Box, Flex, IconButton } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.css'
import { CloseIcon, CheckIcon } from '@chakra-ui/icons'
import { DocumentNode, useMutation } from '@apollo/client'

interface IEditableDatePicker {
  id: string
  refName: string
  defaultValue: Date
  isClearable?: boolean
  showPopperArrow?: boolean
  mutationSchema: DocumentNode
}

const EditableDatePicker: FC<IEditableDatePicker> = ({
  id,
  refName,
  defaultValue,
  showPopperArrow = false,
  mutationSchema,
}) => {
  const [hover, setHover] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [trackedValue, setTrackedValue] = useState(new Date(defaultValue))
  const [date, setDate] = useState(new Date(defaultValue))

  const [updateEntry] = useMutation<FormData>(mutationSchema)

  const onSubmit = (newDate: Date) => {
    setTrackedValue(newDate)
    const test = {
      _id: id,
      [refName]: newDate,
    }
    console.log(test)
    updateEntry({
      variables: {
        payload: {
          _id: id,
          [refName]: newDate,
        },
      },
    })
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Flex>
        <Box>
          {hover ||
          calendarOpen ||
          date.getTime() !== trackedValue.getTime() ? (
            <ReactDatePicker
              selected={date}
              onChange={(date) => {
                setDate(date as Date)
              }}
              showPopperArrow={showPopperArrow}
              onCalendarOpen={() => setCalendarOpen(true)}
              onCalendarClose={() => setCalendarOpen(false)}
            />
          ) : (
            <Text>{date.toLocaleDateString()}</Text>
          )}
        </Box>
        {date.getTime() !== trackedValue.getTime() ? (
          <>
            <Box>
              <IconButton
                my={-3}
                aria-label="reset"
                icon={<CloseIcon />}
                onClick={() => {
                  setHover(false)
                  setDate(trackedValue)
                }}
              />
            </Box>
            <Box>
              <IconButton
                my={-3}
                aria-label="check"
                icon={<CheckIcon />}
                onClick={() => {
                  setHover(false)
                  onSubmit(date)
                }}
              />
            </Box>
          </>
        ) : null}
      </Flex>
    </div>
  )
}

export default EditableDatePicker
