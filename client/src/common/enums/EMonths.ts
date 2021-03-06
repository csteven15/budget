const totalMonths = 12

enum EMonth {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

const MonthArray: string[] = Object.keys(EMonth).splice(totalMonths)

export { EMonth, MonthArray }
