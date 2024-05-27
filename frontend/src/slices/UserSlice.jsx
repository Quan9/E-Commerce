import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const UserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN_START: (state) => {
      state.loading = true;
      state.error = null;
    },
    LOGIN_SUCCESS: (state, action) => {
      localStorage.setItem("user",JSON.stringify( action.payload));
      state.user = JSON.parse(localStorage.getItem('user'));
      state.loading = false;
      state.error = null;
    },
    LOGIN_FAILURE: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    LOGOUT: (state) => {
      localStorage.removeItem("user");
      state.user = null
      state.loading = false
      state.error = null
    },
  },
});
export const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } =
  UserSlice.actions;

export default UserSlice.reducer;
