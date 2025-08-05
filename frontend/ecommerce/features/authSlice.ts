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
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await API.login(credentials);
      const token = response.data.access;
      const role = response.data.role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      return { token, role };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Login failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
reducers: {
  logout(state) {
    state.token = null;
    state.role = null;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
  rehydrateAuth(state) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      state.token = token;
      state.role = role;
    }
  }
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
