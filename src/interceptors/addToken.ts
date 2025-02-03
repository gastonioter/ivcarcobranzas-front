import { RootState } from "@/redux";

export const addToken = (headers: Headers, { getState }) => {
  // Puedes obtener el token desde el estado y agregarlo a headers si es necesario
  const token = (getState() as RootState).auth.token;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
