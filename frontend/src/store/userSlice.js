import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  profile: null, // { name, email, avatar }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.profile = action.payload; // e.g. { name: "John", email: "john@example.com" }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
