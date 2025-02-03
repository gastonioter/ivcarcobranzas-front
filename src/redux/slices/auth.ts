// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("auth") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.token = null;
    },
  },
});

export const isAuthSelector = (state: AuthState) => !!state.token;
export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
