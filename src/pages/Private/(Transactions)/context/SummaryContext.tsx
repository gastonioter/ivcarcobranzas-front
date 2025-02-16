import { createContext } from "@/context/create-context.util";
import {
  Action,
  initialState,
  reducer,
  SummaryState,
} from "../reducers/summaryReducer";
import { Dispatch, PropsWithChildren, useReducer } from "react";

type SummaryContext = {
  dispatch: Dispatch<Action>;
  summary: SummaryState;
};

const [useContext, Provider] = createContext<SummaryContext>();

export const useSummaryContext = useContext;

export default function SummaryProvider({ children }: PropsWithChildren) {
  const [summary, dispatch] = useReducer(reducer, initialState);

  return (
    <Provider
      value={{
        summary,
        dispatch,
      }}
    >
      {children}
    </Provider>
  );
}
