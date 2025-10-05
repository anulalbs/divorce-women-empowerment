import { createSlice } from "@reduxjs/toolkit";

const profile = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  isLoggedIn: profile ? true : false,
  profile, 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.profile = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
      localStorage.removeItem(`token`);
      localStorage.removeItem(`user`);
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
