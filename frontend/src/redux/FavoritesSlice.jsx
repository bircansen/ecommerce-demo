// src/redux/FavoritesSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../setupAxios"; // ✅ axios instance

// ✅ Favorileri backend’den çek
export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Token bulunamadı");
      }

      const res = await API.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data; // ✅ normalize edilmiş ürün listesi
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Favori ekle/çıkar
export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Token bulunamadı");
      }

      const res = await API.post(
        `/favorites/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data; // ✅ backend’den dönen GÜNCEL favori listesi
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],   // ✅ normalize edilmiş favori ürün listesi
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FAVORİLERİ GETİR
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      // ✅ FAVORİ EKLE/ÇIKAR
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favoritesSlice.reducer;
