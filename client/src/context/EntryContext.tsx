import React, {
  useState,
  useContext,
  createContext,
  FC,
  useEffect,
  useCallback,
} from "react";
import { AxiosResponse } from "axios";

import { IEntry } from "../common/types";
import Api from "../util/Api";
import { useAuth } from "./AuthContext";

interface IContextProps {
  entries: IEntry[];
  setEntry: (entry: IEntry) => void;
  deleteEntry: (id: string) => void;
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

  const getEntries = useCallback(async () => {
    if (!user.isLoggedIn) {
      clearEntries();
      return;
    }
    let res: AxiosResponse<IEntry[]> = await Api.get(`/entry/${user.uid}`, {});
    let entries: IEntry[] = res.data;
    setState((oldState: IEntry[]) => [...oldState, ...entries]);
  }, [user.isLoggedIn, user.uid]);

  useEffect(() => {
    getEntries();
  }, [user.isLoggedIn, getEntries]);

  const clearEntries = () => {
    setState([]);
  };

  const deleteEntry = (id: string) => {
    Api.delete(`/entry/${id}`);
    setState((oldState: IEntry[]) =>
      oldState.filter(entry => entry._id !== id));
  };

  const setEntry = (entry: IEntry) => {
    setState((oldState: IEntry[]) => [...oldState, entry]);
  };

  return {
    entries: state,
    setEntry,
    deleteEntry
  };
};
