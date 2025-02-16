import { useMemo } from "react";
import { useSummaryContext } from "../context/SummaryContext";

export const useSummaryDispatch = () => {
  const { dispatch } = useSummaryContext();
  return useMemo(() => dispatch, [dispatch]);
};

export const useSummary = () => {
  const { summary } = useSummaryContext();
  return useMemo(() => summary, [summary]);
};
