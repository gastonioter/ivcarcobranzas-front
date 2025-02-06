import { useAppSelector } from "./useAppSelector";

export const useUserData = () => {
  return useAppSelector((state) => state.auth.user);
};
