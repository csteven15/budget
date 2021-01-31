import { EInputType } from '../common/enums'
import { IEntry } from '../common/types'

export enum EMonthViewActions {
  SET_MONTH = 'SET_MONTH',
  NEXT_MONTH = 'NEXT_MONTH',
  PREV_MONTH = 'PREV_MONTH',
  SET_YEAR = 'SET_YEAR',
  UPDATE_ENTRIES = 'UPDATE_ENTRIES',
}

export interface SetMonthAction {
  type: EMonthViewActions.SET_MONTH
  payload: {
    month: number
  }
}

export interface NextMonthAction {
  type: EMonthViewActions.NEXT_MONTH
  payload: {
    entries: IEntry[]
  }
}

export interface PrevMonthAction {
  type: EMonthViewActions.PREV_MONTH
  payload: {
    entries: IEntry[]
  }
}

export interface SetYearAction {
  type: EMonthViewActions.SET_YEAR
  payload: {
    year: number
    entries: IEntry[]
  }
}

export interface UpdateEntriesAction {
  type: EMonthViewActions.UPDATE_ENTRIES
  payload: {
    entries: IEntry[]
  }
}

export interface IMonthViewState {
  monthIndex: number
  year: number
  entries: IEntry[]
  monthlyIncome: IEntry[]
  monthlyExpense: IEntry[]
}

export type Action =
  | SetMonthAction
  | NextMonthAction
  | PrevMonthAction
  | SetYearAction
  | UpdateEntriesAction

export const setMonthAction = (month: number): SetMonthAction => {
  const action: SetMonthAction = {
    type: EMonthViewActions.SET_MONTH,
    payload: {
      month: month,
    },
  }
  return action
}

export const nextMonthAction = (entries: IEntry[]): NextMonthAction => {
  const action: NextMonthAction = {
    type: EMonthViewActions.NEXT_MONTH,
    payload: {
      entries: entries,
    },
  }
  return action
}

export const prevMonthAction = (entries: IEntry[]): PrevMonthAction => {
  const action: PrevMonthAction = {
    type: EMonthViewActions.PREV_MONTH,
    payload: {
      entries: entries,
    },
  }
  return action
}

export const setYearAction = (
  year: number,
  entries: IEntry[]
): SetYearAction => {
  const action: SetYearAction = {
    type: EMonthViewActions.SET_YEAR,
    payload: {
      year: year,
      entries: entries,
    },
  }
  return action
}

export const updateEntriesAction = (entries: IEntry[]): UpdateEntriesAction => {
  const action: UpdateEntriesAction = {
    type: EMonthViewActions.UPDATE_ENTRIES,
    payload: {
      entries: entries,
    },
  }
  return action
}

export const monthViewReducer = (
  state: IMonthViewState,
  action: Action
): IMonthViewState => {
  switch (action.type) {
    case EMonthViewActions.SET_MONTH: {
      return {
        ...state,
        monthIndex: action.payload.month,
      }
    }
    case EMonthViewActions.NEXT_MONTH: {
      let nextMonthIndex = state.monthIndex + 1
      let curYear = state.year
      let updatedIncomes = state.monthlyIncome
      let updatedExpenses = state.monthlyExpense
      const entries = action.payload.entries
      if (nextMonthIndex > 11) {
        nextMonthIndex = 0
        curYear++
        // update the entries
        updatedIncomes = entries.filter(
          (entry) =>
            entry.year === curYear && entry.inputType === EInputType.Income
        )
        updatedExpenses = entries.filter(
          (entry) =>
            entry.year === curYear && entry.inputType === EInputType.Expense
        )
      }
      return {
        ...state,
        monthIndex: nextMonthIndex,
        year: curYear,
        monthlyIncome: updatedIncomes,
        monthlyExpense: updatedExpenses,
      }
    }
    case EMonthViewActions.PREV_MONTH: {
      let prevMonthIndex = state.monthIndex - 1
      let curYear = state.year
      let updatedIncomes = state.monthlyIncome
      let updatedExpenses = state.monthlyExpense
      const entries = action.payload.entries
      if (prevMonthIndex < 0) {
        prevMonthIndex = 11
        curYear--
        // update the entries
        updatedIncomes = entries.filter(
          (entry) =>
            entry.year === curYear && entry.inputType === EInputType.Income
        )
        updatedExpenses = entries.filter(
          (entry) =>
            entry.year === curYear && entry.inputType === EInputType.Expense
        )
      }
      return {
        ...state,
        monthIndex: prevMonthIndex,
        year: curYear,
        monthlyIncome: updatedIncomes,
        monthlyExpense: updatedExpenses,
      }
    }
    case EMonthViewActions.SET_YEAR: {
      const entries = action.payload.entries
      const updatedIncomes = entries.filter(
        (entry) =>
          entry.year === action.payload.year &&
          entry.inputType === EInputType.Income
      )
      const updatedExpenses = entries.filter(
        (entry) =>
          entry.year === action.payload.year &&
          entry.inputType === EInputType.Expense
      )
      return {
        ...state,
        year: action.payload.year,
        monthlyIncome: updatedIncomes,
        monthlyExpense: updatedExpenses,
      }
    }
    case EMonthViewActions.UPDATE_ENTRIES: {
      state.entries = action.payload.entries
      state.monthlyIncome = state.entries.filter(
        (entry) =>
          entry.year === state.year && entry.inputType === EInputType.Income
      )
      state.monthlyExpense = state.entries.filter(
        (entry) =>
          entry.year === state.year && entry.inputType === EInputType.Expense
      )
      return {
        ...state,
      }
    }
    default:
      return state
  }
}
