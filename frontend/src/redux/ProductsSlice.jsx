import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],          // Tüm ürünler burada tutulacak (frontend search için)
  selectedProduct: {},
  loading: false,
  searchResults: [],     // Arama sonuçları
  searchLoading: false,  // Aramada loading göstermek istersen
};

/*  
  ✅ Tüm ürünleri bir defada alıyoruz.
  Arama frontend'de yapılacağı için
  backend'den sadece bir kez çekmek yeterli.
*/
export const getAllProduct = createAsyncThunk(
  "products/getAllProduct",
  async (_, thunkAPI) => {
    try {
      // Tüm ürünleri çek → pagination sorunu böyle çözülür
      const response = await axios.get(`/api/products?page=1&limit=2000`);
      return response.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Ürün detaylarında seçilen ürün
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    // Smart search results'ı temizleme
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    /*  
      ✅ FRONTEND AKILLI ARAMA  
      Input'a yazılan harfe göre ürünleri filtreler.
      Backend'e istek YOK, anında sonuç döner.
    */
    searchLocalProducts: (state, action) => {
      const query = action.payload?.toLowerCase().trim();

      if (!query) {
        state.searchResults = [];
        return;
      }

      // Başlık (title) içinde arama
      state.searchResults = state.products.filter((p) =>
        p.title?.toLowerCase().includes(query)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ Ürünleri çekme
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        // Backend'ten dönen format:
        // { page, limit, total, data: [] }
        if (payload && Array.isArray(payload.data)) {
          state.products = payload.data;
        }
        // Eğer direkt array dönerse
        else if (Array.isArray(payload)) {
          state.products = payload;
        }
        // Hiçbir şey bulunamazsa
        else {
          state.products = [];
        }
      })
      .addCase(getAllProduct.rejected, (state) => {
        state.loading = false;
        state.products = [];
      });
  },
});

export const {
  setSelectedProduct,
  clearSearchResults,
  searchLocalProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
