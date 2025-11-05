import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../setupAxios"; // axios config dosyanı kullan

// 🔹 LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      return res.data; // backend: { user, token, message }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Giriş hatası" });
    }
  }
);

// 🔹 REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await API.post("/auth/register", { name, email, password });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Kayıt hatası" });
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        // ✅ localStorage’a kaydet
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // 🔸 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = UserSlice.actions;
export default UserSlice.reducer;
