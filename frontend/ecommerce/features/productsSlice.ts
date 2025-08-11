import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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

export const fetchProducts = createAsyncThunk<
  { results: Product[] },
  { page?: number; filters?: any; sort?: string; search?: string }
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await apiConfig.getAllProducts(params);
    console.log("Fetched products:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch products");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ results: Product[] }>) => {
        state.status = "succeeded";
        state.items = action.payload?.results || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || "Error fetching products";
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
