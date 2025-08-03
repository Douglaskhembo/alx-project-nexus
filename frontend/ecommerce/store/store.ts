import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/productsSlice";
import authReducer from "../features/authSlice";
import cartReducer from "../features/cartSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
