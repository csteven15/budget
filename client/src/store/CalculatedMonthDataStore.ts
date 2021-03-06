import { EInputType, MonthArray } from '../common/enums'
import { IAccount, IEntry } from '../common/types'
import { getTotalAppliedToBudget, sumUp } from '../util/Calculations'

export enum ECalculatedDataStoreAction {
  SET_MONTH = 'SET_MONTH',
  NEXT_MONTH = 'NEXT_MONTH',
  PREV_MONTH = 'PREV_MONTH',
  SET_YEAR = 'SET_YEAR',
  UPDATE_ENTRIES = 'UPDATE_ENTRIES',
}

export interface SetMonthAction {
  type: ECalculatedDataStoreAction.SET_MONTH
  payload: {
    month: number
  }
}

export interface NextMonthAction {
  type: ECalculatedDataStoreAction.NEXT_MONTH
}

export interface PrevMonthAction {
  type: ECalculatedDataStoreAction.PREV_MONTH
}

export interface SetYearAction {
  type: ECalculatedDataStoreAction.SET_YEAR
  payload: {
    year: number
  }
}

export interface UpdateEntriesAction {
  type: ECalculatedDataStoreAction.UPDATE_ENTRIES
  payload: {
    entries: IEntry[]
    accounts: IAccount[]
  }
}

export interface ICalcualtedMonth {
  monthIndex: number
  year: number
  monthlyIncome: IEntry[]
  monthlyExpense: IEntry[]
  incomeTotal: number
  expenseTotal: number
  endOfMonthTotal: number
  balance: number
}

export interface ICalculatedMonthState {
  calculatedMonthData: ICalcualtedMonth[]
  totalAccountAppliedToBudget: number
  month: number
  year: number
}

export type Action =
  | SetMonthAction
  | NextMonthAction
  | PrevMonthAction
  | SetYearAction
  | UpdateEntriesAction

export const setMonthAction = (month: number): SetMonthAction => {
  const action: SetMonthAction = {
    type: ECalculatedDataStoreAction.SET_MONTH,
    payload: {
      month: month,
    },
  }
  return action
}

export const nextMonthAction = (): NextMonthAction => {
  const action: NextMonthAction = {
    type: ECalculatedDataStoreAction.NEXT_MONTH,
  }
  return action
}

export const prevMonthAction = (): PrevMonthAction => {
  const action: PrevMonthAction = {
    type: ECalculatedDataStoreAction.PREV_MONTH,
  }
  return action
}

export const setYearAction = (year: number): SetYearAction => {
  const action: SetYearAction = {
    type: ECalculatedDataStoreAction.SET_YEAR,
    payload: {
      year: year,
    },
  }
  return action
}

export const updateEntriesAction = (
  entries: IEntry[],
  accounts: IAccount[]
): UpdateEntriesAction => {
  const action: UpdateEntriesAction = {
    type: ECalculatedDataStoreAction.UPDATE_ENTRIES,
    payload: {
      entries: entries,
      accounts: accounts,
    },
  }
  return action
}

export const calculatedDataStoreReducer = (
  state: ICalculatedMonthState,
  action: Action
): ICalculatedMonthState => {
  switch (action.type) {
    case ECalculatedDataStoreAction.SET_MONTH: {
      const month = action.payload.month
      return {
        ...state,
        month: month,
      }
    }
    case ECalculatedDataStoreAction.NEXT_MONTH: {
      let nextMonthIndex = state.month + 1
      let curYear = state.year
      if (nextMonthIndex > 11) {
        nextMonthIndex = 0
        curYear++
      }
      return {
        ...state,
        month: nextMonthIndex,
        year: curYear,
      }
    }
    case ECalculatedDataStoreAction.PREV_MONTH: {
      let prevMonthIndex = state.month - 1
      let curYear = state.year
      if (prevMonthIndex < 0) {
        prevMonthIndex = 11
        curYear--
      }
      return {
        ...state,
        month: prevMonthIndex,
        year: curYear,
      }
    }
    case ECalculatedDataStoreAction.SET_YEAR: {
      const year = action.payload.year
      return {
        ...state,
        year: year,
      }
    }
    // Dispatch needs to be called if entries need to be updated
    case ECalculatedDataStoreAction.UPDATE_ENTRIES: {
      const entries = action.payload.entries
      const accounts = action.payload.accounts

      const filteredEntriesByYear = entries.filter(
        (entry) => entry.year === state.year
      )

      state.totalAccountAppliedToBudget = getTotalAppliedToBudget(accounts)

      MonthArray.forEach((_, i) => {
        const monthlyIncome = filteredEntriesByYear.filter(
          (entry) =>
            entry.year === state.year && entry.inputType === EInputType.Income
        )
        const monthlyExpense = filteredEntriesByYear.filter(
          (entry) =>
            entry.year === state.year && entry.inputType === EInputType.Expense
        )
        state.calculatedMonthData[i].monthlyIncome = monthlyIncome
        state.calculatedMonthData[i].monthlyExpense = monthlyExpense
        const incomeAmountList = monthlyIncome.map(
          (entry) => entry.monthlyAmount[i]!
        )
        state.calculatedMonthData[i].incomeTotal = sumUp(
          incomeAmountList.flat()
        )
        const expenseAmountList = monthlyExpense.map(
          (entry) => entry.monthlyAmount[i]!
        )
        state.calculatedMonthData[i].expenseTotal = sumUp(
          expenseAmountList.flat()
        )
        state.calculatedMonthData[i].balance =
          state.calculatedMonthData[i].incomeTotal -
          state.calculatedMonthData[i].expenseTotal

        let totalAccountBalanceToApply = 0
        if (i === 0) {
          totalAccountBalanceToApply = state.totalAccountAppliedToBudget
        } else {
          totalAccountBalanceToApply =
            state.calculatedMonthData[i - 1].endOfMonthTotal
        }
        state.calculatedMonthData[i].endOfMonthTotal =
          totalAccountBalanceToApply + state.calculatedMonthData[i].balance
      })

      return {
        ...state,
      }
    }
    default:
      return {
        ...state,
      }
  }
}
