import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/apiConfig";

interface AuthState {
  token: string | null;
  role: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  role: typeof window !== "undefined" ? localStorage.getItem("role") : null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.login(credentials);

      const token = response.data.access;
      const refreshToken = response.data.refresh;
      const role = response.data.role;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);
      }

      return { token, refreshToken, role };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Login failed"
      );
    }
  }
);

export const rehydrateAuth = createAsyncThunk("auth/rehydrate", async () => {
  if (typeof window !== "undefined") {
    return {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
    };
  }
  return { token: null, role: null };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(rehydrateAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
