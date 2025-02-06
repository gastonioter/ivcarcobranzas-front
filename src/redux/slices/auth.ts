// features/auth/authSlice.ts
import { TokenPayload } from "@/models";
import { decodeToken } from "@/utilities/decodeToken";
import { getLocalStorage } from "@/utilities/localstorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: TokenPayload | null;
}

const initialState: AuthState = {
  token: getLocalStorage("auth"),
  user: generateUser(getLocalStorage("auth")),
};

function generateUser(token: string | null): TokenPayload | null {
  return token ? decodeToken(token) : null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.user = decodeToken(state.token);
    },
    clearCredentials: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
