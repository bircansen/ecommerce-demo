import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://fakestoreapi.com";

const initialState = {
  products: [],
  selectedProduct: {},
  loading: false
};

// Tüm ürünleri çekmek için async thunk
export const getAllProduct = createAsyncThunk(
  "products/getAllProduct",
  async () => {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      });
  }
});

export const { setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
