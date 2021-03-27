import React, { FC } from 'react'
import ReactDatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.css'

interface IDatePicker {
  isClearable?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (date: Date) => any
  selectedDate: Date
  showPopperArrow?: boolean
}

const DatePicker: FC<IDatePicker> = ({
  onChange,
  selectedDate,
  isClearable = false,
  showPopperArrow = false,
}) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
    />
  )
}

export default DatePicker
