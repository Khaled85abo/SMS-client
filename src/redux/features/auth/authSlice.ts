import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
  token: string | null;
  user: null | any;
};
const initialState: InitialState = {
  token: localStorage.getItem("token") || null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      localStorage.setItem("token", token);
      state.token = token;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
