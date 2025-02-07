import { User } from "@/models";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string): User | null => {
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};
