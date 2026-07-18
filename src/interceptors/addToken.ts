export const addToken = (headers: Headers, { getState }: { getState: any }) => {
  const token = getState().auth.token;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
