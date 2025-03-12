import { RootState } from "@/redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addToken = (headers: Headers, { getState }: { getState: any }) => {
  // Puedes obtener el token desde el estado y agregarlo a headers si es necesario
  const token = (getState() as RootState).auth.token;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
