import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiConfig from "../services/apiConfig";
import { Product } from "../types";

interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: { page?: number; filters?: any; sort?: string; search?: string }) => {
    const response = await apiConfig.getAllProducts(params);
    console.log("Fetched products:", response.data);
    return response.data;
  }
);


const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.results;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error fetching products";
      });
  },
});

export default productsSlice.reducer;
