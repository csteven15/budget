import React, {
  useState,
  useContext,
  createContext,
  FC,
  useEffect,
} from "react";
import { AxiosResponse } from "axios";

import { IEntry } from "../common/types/IEntry";
import Api from "../util/Api";
import { useAuth } from "./AuthContext";

interface IContextProps {
  entries: IEntry[];
  setEntry: (entry: IEntry) => void;
}

const EntryContext = createContext({} as IContextProps);

export const INITIAL_ENTRIES: IEntry[] = [];

export const EntryProvider: FC<{}> = ({ children }) => {
  const entries = useProvideEntry();
  return (
    <EntryContext.Provider value={entries}>{children}</EntryContext.Provider>
  );
};

export const useEntry = () => {
  return useContext(EntryContext);
};

const useProvideEntry = () => {
  const { user } = useAuth();
  const [state, setState] = useState(INITIAL_ENTRIES);

  const getEntries = async () => {
    if (!user.isLoggedIn) {
      clearEntries();
      return;
    }
    let res: AxiosResponse<IEntry[]> = await Api.get(`/entry/${user.uid}`, {});
    let entries = res.data.filter((entry) => entry.uid === user.uid);
    setEntries(entries);
  };

  useEffect(() => {
    getEntries();
  }, [user.isLoggedIn]);

  const clearEntries = () => {
    setState([]);
  };

  const setEntries = (entries: IEntry[]) => {
    let newState = [...state, ...entries];
    setState(newState);
  };

  const setEntry = (entry: IEntry) => {
    let newState = [...state, entry];
    setState(newState);
  };

  return {
    entries: state,
    setEntry,
  };
};
