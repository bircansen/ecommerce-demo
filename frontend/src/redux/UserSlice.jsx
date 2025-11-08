// src/redux/UserSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../setupAxios";
import {
  clearBasketServer,
  clearBasketLocal,
} from "./BasketSlice"; // BasketSlice’daki export’lar

// -------------------- Thunks --------------------

// LOGIN
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      return res.data; // { user, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Giriş hatası" }
      );
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await API.post("/auth/register", { name, email, password });
      return res.data; // { user, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Kayıt hatası" }
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const currentUser = state.user.user;

    try {
      // Kullanıcı giriş yapmışsa server sepetini, yoksa local sepeti temizle
      if (currentUser && (currentUser._id || currentUser.id)) {
        await thunkAPI.dispatch(
          clearBasketServer(currentUser._id ?? currentUser.id)
        );
      } else {
        thunkAPI.dispatch(clearBasketLocal());
      }

      // Kullanıcı bilgilerini temizle
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    } catch (err) {
      return thunkAPI.rejectWithValue("Çıkış başarısız.");
    }
  }
);

// -------------------- Slice --------------------
const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Giriş başarısız.";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Kayıt başarısız.";
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UserSlice.reducer;
