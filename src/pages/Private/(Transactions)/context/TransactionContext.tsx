import { Dispatch, PropsWithChildren, useReducer } from "react";
import { Action, initialState, reducer, TransactionState } from "./reducer";
import { createContext } from "@/context/create-context.util";
type TransactionContext = {
  dispatch: Dispatch<Action>;
  transaction: TransactionState;
};

const [useContext, Provider] = createContext<TransactionContext>();

export const useTransactionContext = useContext;

export const TransactionProvider = ({ children }: PropsWithChildren) => {
  const [transaction, dispatch] = useReducer(reducer, initialState);

  return (
    <Provider
      value={{
        dispatch,
        transaction,
      }}
    >
      {children}
    </Provider>
  );
};
