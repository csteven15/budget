import { useState, useContext, createContext, FC, useEffect } from 'react'

import fire from '../util/fire'
import { IUser } from '../common/types'

interface IContextProps {
  user: IUser
  signIn: (uid: string, name: string) => void
  signOut: () => void
}

const AuthContext = createContext({} as IContextProps)

export const INITIAL_USER: IUser = {
  uid: '',
  name: '',
  isLoggedIn: false,
  isLoading: true,
}

export const AuthProvider: FC = ({ children }) => {
  const user = useProvideAuth()
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = (): IContextProps => {
  return useContext(AuthContext)
}

const useProvideAuth = () => {
  const [state, setState] = useState<IUser>(INITIAL_USER)

  useEffect(() => {
    getUser()
  }, [state.isLoggedIn])

  const getUser = () => {
    if (!state.isLoggedIn) setState({ ...state, isLoading: true })
    fire.auth().onAuthStateChanged((user) => {
      setState({
        uid: user?.uid,
        name: user?.displayName ?? '',
        isLoggedIn: user ? true : false,
        isLoading: false,
      })
    })
  }

  const signIn = (uid: string, name: string) => {
    setState({
      ...state,
      uid: uid,
      name: name,
      isLoggedIn: true,
    })
  }

  const signOut = () => {
    fire.auth().signOut()
    setState({
      ...state,
      uid: undefined,
      name: undefined,
      isLoggedIn: false,
    })
  }

  console.log(fire.auth().currentUser)

  console.log(state)

  return {
    user: state,
    signIn,
    signOut,
  }
}
