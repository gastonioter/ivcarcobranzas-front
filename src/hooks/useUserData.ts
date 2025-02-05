import { TokenPayload } from "@/models";
import { decodeToken } from "@/utilities/decodeToken";
import { useAuthToken } from "./useAuth";

export const useUserData = (): TokenPayload | null => {
  const token = useAuthToken();

  if (!token) return null;

  const decodedToken = decodeToken(token);
  //console.log(decodedToken);
  return decodedToken;
};
