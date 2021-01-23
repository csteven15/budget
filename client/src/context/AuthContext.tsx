import React, {
  useState,
  useContext,
  createContext,
  FC,
  useEffect,
} from "react";

import fire from "../util/fire";
import { IUser } from "../common/types";

interface IContextProps {
  user: IUser;
  signOut: () => void;
}

const AuthContext = createContext({} as IContextProps);

export const INITIAL_USER: IUser = {
  uid: "",
  name: "",
  isLoggedIn: false,
};

export const AuthProvider: FC<{}> = ({ children }) => {
  const user = useProvideAuth();
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const useProvideAuth = () => {
  const [state, setState] = useState<IUser>(INITIAL_USER);

  useEffect(() => {
    getUser();
  }, [state.isLoggedIn]);

  const getUser = () => {
    fire.auth().onAuthStateChanged((user) => {
      setState({
        uid: user?.uid,
        name: user?.displayName,
        isLoggedIn: user ? true : false,
      });
    });
  };

  const signOut = () => {
    fire.auth().signOut();
    setState({
      ...state,
      uid: undefined,
      name: undefined,
      isLoggedIn: false,
    });
  };

  return {
    user: state,
    signOut,
  };
};
