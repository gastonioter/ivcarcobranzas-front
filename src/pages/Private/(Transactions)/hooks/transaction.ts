import { useMemo } from "react";
import { useTransactionContext } from "../context/TransactionContext";

export const useDispatch = () => {
  const { dispatch } = useTransactionContext();
  return useMemo(() => dispatch, [dispatch]);
};

export const useTransaction = () => {
  const { transaction } = useTransactionContext();
  return useMemo(() => transaction, [transaction]);
};
