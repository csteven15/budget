import { FC } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useColorMode } from '@chakra-ui/react'

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
  const isLight = useColorMode().colorMode === 'light'

  return (
    <div className={isLight ? 'light-theme' : 'dark-theme'}>
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        className="react-datapicker__input-text"
      />
    </div>
  )
}

export default DatePicker
