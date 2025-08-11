import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  currency?: { currency_code: string };
  seller?: number | string | { id: number };
  new_price?: number;
  initial_price?: number;
  seller_name?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("cart") || "[]")
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
    ,
    removeFromCart(state, action: PayloadAction<number>) { 
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
