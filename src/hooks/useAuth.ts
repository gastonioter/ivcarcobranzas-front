// hooks/useAuthToken.ts
import { useAppSelector } from "./useAppSelector";

export const useAuthToken = () => {
  return useAppSelector((state) => state.auth.token);
};
