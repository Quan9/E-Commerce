import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./UserSlice";
import cartReducer from "./CartSlice";
const reducer = {
  user: userReducer,
  cart: cartReducer,
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
