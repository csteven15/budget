import React, {
  useState,
  useContext,
  createContext,
  FC
} from "react";

import { IUser } from '../common/types/IUser';

interface IContextProps {
  user: IUser;
  setUser: (userState: IUser) => void
}

const UserContext = createContext({} as IContextProps);

export const INITIAL_USER: IUser = {
  id: undefined,
  name: '',
  email: '',
  isLoggedIn: false,
};

export const UserProvider: FC<{}> = ({children}) => {
  const user = useProvideUser();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  return useContext(UserContext);
};

const useProvideUser = () => {
  const [state, setState] = useState(INITIAL_USER);

  const setUser = (userState: IUser) => {
    let newState = {...state};
    newState.id = userState.id;
    newState.name = userState.name;
    newState.email = userState.email;
    newState.isLoggedIn = userState.isLoggedIn;
    setState(newState);
  };

  return {
    user: state,
    setUser,
  };
}