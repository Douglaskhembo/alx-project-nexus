import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiConfig from "../services/apiConfig";
import { Product } from "../types";

interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  hasMore: boolean;
  totalProducts: number;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  page: 1,
  hasMore: true,
  totalProducts: 0,
};

export const fetchProducts = createAsyncThunk<
  { results: Product[]; page: number; total: number },
  { page?: number; filters?: any; sort?: string; search?: string }
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await apiConfig.getAllProducts(params);
    console.log("Fetched products:", response.data);
    return {
      results: response.data.results,
      page: params.page || 1,
      total: response.data.total || response.data.results.length,
    };
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
      state.page = 1;
      state.hasMore = true;
      state.totalProducts = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<{ results: Product[]; page: number; total: number }>) => {
          state.status = "succeeded";
          if (action.payload.page === 1) {
            state.items = action.payload.results;
          } else {
            state.items = [...state.items, ...action.payload.results];
          }
          state.page = action.payload.page;
          state.totalProducts = action.payload.total;
          state.hasMore = state.items.length < state.totalProducts;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || action.error.message || "Error fetching products";
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
