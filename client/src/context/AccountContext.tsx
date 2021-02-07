import React, {
  useState,
  useContext,
  createContext,
  FC,
  useEffect,
  useCallback,
} from 'react'
import { AxiosResponse } from 'axios'

import { IAccount } from '../common/types'
import Api from '../util/Api'
import { useAuth } from './AuthContext'
import { EResponse } from '../common/enums'

interface IContextProps {
  accounts: IAccount[]
  addAccount: (newAccount: IAccount) => void
  deleteAccount: (id: string) => void
  updateAccount: (updatedAccount: IAccount) => void
}

const AccountContext = createContext({} as IContextProps)

export const INITIAL_ACCOUNTS: IAccount[] = []

export const AccountProvider: FC = ({ children }) => {
  const accounts = useProvideAccount()
  return (
    <AccountContext.Provider value={accounts}>
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = (): IContextProps => {
  return useContext(AccountContext)
}

const useProvideAccount = () => {
  const { user } = useAuth()
  const [state, setState] = useState(INITIAL_ACCOUNTS)

  const getAccounts = useCallback(async () => {
    if (!user.isLoggedIn) {
      clearAccounts()
      return
    }
    const res: AxiosResponse<IAccount[]> = await Api.get(
      `/account/${user.uid}`,
      {}
    )
    if (res.status === EResponse.OK) {
      const accounts: IAccount[] = res.data
      setState((oldState: IAccount[]) => [...oldState, ...accounts])
    }
  }, [user.isLoggedIn, user.uid])

  useEffect(() => {
    getAccounts()
  }, [user.isLoggedIn, getAccounts])

  const clearAccounts = () => {
    setState([])
  }

  const deleteAccount = async (id: string) => {
    try {
      const res: AxiosResponse<IAccount> = await Api.delete(`/account/${id}`)
      if (res.status === EResponse.OK) {
        setState((oldState: IAccount[]) =>
          oldState.filter((Account) => Account._id !== id)
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateAccount = async (updatedAccount: IAccount) => {
    let found = false
    const newAccounts = state.map((account) => {
      if (account._id === updatedAccount._id) {
        found = true
        return {
          ...account,
          _id: updatedAccount._id,
          uid: updatedAccount.uid,
          name: updatedAccount.name,
          type: updatedAccount.type,
          total: updatedAccount.total,
          isAppliedToBudget: updatedAccount.isAppliedToBudget,
        }
      }
      return account
    })
    if (found) {
      try {
        const res: AxiosResponse<IAccount> = await Api.put(
          `/account/${updatedAccount._id}`,
          updatedAccount
        )
        if (res.status === EResponse.OK) {
          setState(newAccounts)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const addAccount = async (newAccount: IAccount) => {
    try {
      const res: AxiosResponse<IAccount> = await Api.post(
        '/account',
        newAccount
      )
      console.log('status: ', res.status)
      if (res.status === EResponse.Created) {
        const account = res.data
        setState((oldState: IAccount[]) => [...oldState, account])
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    accounts: state,
    addAccount,
    deleteAccount,
    updateAccount,
  }
}
