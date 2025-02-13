import { User } from "@/models";
import { authApi } from "@/services";
import { decodeToken } from "@/utilities/decodeToken";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utilities/localstorage";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: getLocalStorage("token") || null,
  user: decodeToken(getLocalStorage("token") || ""),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      removeLocalStorage("token");
    },
  },
  extraReducers: (builder) => {
    /* triggerd after successfull login */
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = decodeToken(state.token);
        setLocalStorage("token", state.token);
      }
    );
  },
});

export const { clearCredentials } = authSlice.actions;
export default authSlice.reducer;
