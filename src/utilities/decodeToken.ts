import { TokenPayload } from "@/models";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    //console.log(decodedToken as TokenPayload);
    return decodedToken;
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
};
