import React, {
  useState,
  useContext,
  createContext,
  FC,
  useEffect,
  useCallback,
} from 'react'
import { AxiosResponse } from 'axios'

import { IEntry } from '../common/types'
import Api from '../util/Api'
import { useAuth } from './AuthContext'
import { EResponse } from '../common/enums'

interface IContextProps {
  entries: IEntry[]
  addEntry: (newEntry: IEntry) => void
  deleteEntry: (id: string) => void
  updateEntry: (updatedEntry: IEntry) => void
}

const EntryContext = createContext({} as IContextProps)

export const INITIAL_ENTRIES: IEntry[] = []

export const EntryProvider: FC = ({ children }) => {
  const entries = useProvideEntry()
  return (
    <EntryContext.Provider value={entries}>{children}</EntryContext.Provider>
  )
}

export const useEntry = (): IContextProps => {
  return useContext(EntryContext)
}

const useProvideEntry = () => {
  const { user } = useAuth()
  const [state, setState] = useState(INITIAL_ENTRIES)

  const getEntries = useCallback(async () => {
    if (!user.isLoggedIn) {
      clearEntries()
      return
    }
    const res: AxiosResponse<IEntry[]> = await Api.get(`/entry/${user.uid}`, {})
    if (res.status === EResponse.OK) {
      const entries: IEntry[] = res.data
      setState((oldState: IEntry[]) => [...oldState, ...entries])
    }
  }, [user.isLoggedIn, user.uid])

  useEffect(() => {
    getEntries()
  }, [user.isLoggedIn, getEntries])

  const clearEntries = () => {
    setState([])
  }

  const deleteEntry = async (id: string) => {
    try {
      const res: AxiosResponse<IEntry> = await Api.delete(`/entry/${id}`)
      if (res.status === EResponse.OK) {
        setState((oldState: IEntry[]) =>
          oldState.filter((entry) => entry._id !== id)
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateEntry = async (updatedEntry: IEntry) => {
    let found = false
    const newEntries = state.map((entry) => {
      if (entry._id === updatedEntry._id) {
        found = true
        return {
          ...entry,
          _id: updatedEntry._id,
          uid: updatedEntry.uid,
          name: updatedEntry.name,
          year: updatedEntry.year,
          inputType: updatedEntry.inputType,
          maxAmount: updatedEntry.maxAmount,
          monthlyAmount: updatedEntry.monthlyAmount,
        }
      }
      return entry
    })
    if (found) {
      try {
        const res: AxiosResponse<IEntry> = await Api.put(
          `/entry/${updatedEntry._id}`,
          updatedEntry
        )
        if (res.status === EResponse.OK) {
          setState(newEntries)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const addEntry = async (newEntry: IEntry) => {
    try {
      const res: AxiosResponse<IEntry> = await Api.post('/entry', newEntry)
      console.log('status: ', res.status)
      if (res.status === EResponse.Created) {
        const entry = res.data
        setState((oldState: IEntry[]) => [...oldState, entry])
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    entries: state,
    addEntry,
    deleteEntry,
    updateEntry,
  }
}
