import { FC, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Text, Box, Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { CloseIcon, CheckIcon } from '@chakra-ui/icons'

import { useGenericMutation } from '../../hooks/useGenericMutation'

import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.css'

interface IEditableDatePicker {
  id: string
  refName: string
  defaultValue: Date
  isClearable?: boolean
  showPopperArrow?: boolean
  mutationSchema: string
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
  const isLight = useColorMode().colorMode === 'light'

  const { mutate } = useGenericMutation(mutationSchema)

  const onSubmit = (newDate: Date) => {
    setTrackedValue(newDate)
    mutate({
      payload: {
        _id: id,
        [refName]: new Date(newDate.setHours(0, 0, 0, 0)),
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
            <div className={isLight ? 'light-theme' : 'dark-theme'}>
              <ReactDatePicker
                selected={date}
                onChange={(date) => {
                  setDate(date as Date)
                }}
                showPopperArrow={showPopperArrow}
                onCalendarOpen={() => setCalendarOpen(true)}
                onCalendarClose={() => setCalendarOpen(false)}
                className="react-datapicker__input-text"
              />
            </div>
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
