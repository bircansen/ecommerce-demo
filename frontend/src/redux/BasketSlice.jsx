// src/redux/BasketSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../setupAxios"; // ✅ axios değil, PROJENİN API CONFIGİ



// -------------------- Server thunks --------------------

// ✅ FETCH
export const fetchBasket = createAsyncThunk(
  "basket/fetchBasket",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/basket/${userId}`);
      return res.data.cart ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Sepet yüklenemedi");
    }
  }
);

// ✅ ADD
export const addToBasketServer = createAsyncThunk(
  "basket/addToBasketServer",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/basket/add`, { userId, productId });
      return res.data.cart ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Sepete eklenemedi");
    }
  }
);

// ✅ DECREASE
export const decreaseQuantityServer = createAsyncThunk(
  "basket/decreaseQuantityServer",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/basket/decrease`, { userId, productId });
      return res.data.cart ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Miktar azaltılamadı");
    }
  }
);

// ✅ REMOVE
export const removeFromBasketServer = createAsyncThunk(
  "basket/removeFromBasketServer",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/basket/remove`, { userId, productId });
      return res.data.cart ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ürün kaldırılamadı");
    }
  }
);

// ✅ CLEAR
export const clearBasketServer = createAsyncThunk(
  "basket/clearBasketServer",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await API.post(`/basket/clear`, { userId });
      return res.data.cart ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Sepet temizlenemedi");
    }
  }
);



// -------------------- Local reducers --------------------

const initialState = {
  addedToBasket: JSON.parse(localStorage.getItem("addedToBasket")) || [],
  loading: false,
  error: null,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // ✅ LOCAL ADD
    addToBasketLocal: (state, action) => {
      const payload = action.payload;
      const id = payload.productId ?? payload.id ?? payload._id;

      if (!id) return;

      const exist = state.addedToBasket.find(
        (it) => (it.productId ?? it.id ?? it._id) === id
      );

      if (exist) {
        exist.quantity += 1;
      } else {
        state.addedToBasket.push({
          productId: id,
          quantity: 1,
          price: payload.price ?? 0,
          title: payload.title ?? "",
          image: payload.image,
        });
      }

      localStorage.setItem("addedToBasket", JSON.stringify(state.addedToBasket));
    },

    // ✅ LOCAL DECREASE
    decreaseQuantityLocal: (state, action) => {
      const id = action.payload.productId ?? action.payload.id;

      const exist = state.addedToBasket.find(
        (it) => (it.productId ?? it.id) === id
      );
      if (!exist) return;

      if (exist.quantity > 1) exist.quantity--;
      else
        state.addedToBasket = state.addedToBasket.filter(
          (it) => (it.productId ?? it.id) !== id
        );

      localStorage.setItem("addedToBasket", JSON.stringify(state.addedToBasket));
    },

    // ✅ LOCAL REMOVE
    removeFromBasketLocal: (state, action) => {
      const id = action.payload.productId ?? action.payload.id;

      state.addedToBasket = state.addedToBasket.filter(
        (it) => (it.productId ?? it.id) !== id
      );

      localStorage.setItem("addedToBasket", JSON.stringify(state.addedToBasket));
    },

    // ✅ LOCAL CLEAR
    clearBasketLocal: (state) => {
      state.addedToBasket = [];
      localStorage.removeItem("addedToBasket");
    },
  },

  // -------------------- Server reducers --------------------
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchBasket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasket.fulfilled, (state, action) => {
        state.loading = false;
        state.addedToBasket = action.payload ?? [];
      })
      .addCase(fetchBasket.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? action.payload ?? "Fetch failed";
      })

      // ADD
      .addCase(addToBasketServer.fulfilled, (state, action) => {
        state.addedToBasket = action.payload ?? [];
      })
      .addCase(addToBasketServer.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.payload ?? "Add failed";
      })

      // DECREASE
      .addCase(decreaseQuantityServer.fulfilled, (state, action) => {
        state.addedToBasket = action.payload ?? [];
      })
      .addCase(decreaseQuantityServer.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.payload ?? "Decrease failed";
      })

      // REMOVE
      .addCase(removeFromBasketServer.fulfilled, (state, action) => {
        state.addedToBasket = action.payload ?? [];
      })
      .addCase(removeFromBasketServer.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.payload ?? "Remove failed";
      })

      // CLEAR
      .addCase(clearBasketServer.fulfilled, (state, action) => {
        state.addedToBasket = action.payload ?? [];
      })
      .addCase(clearBasketServer.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.payload ?? "Clear failed";
      });
  },
});

export const {
  addToBasketLocal,
  decreaseQuantityLocal,
  removeFromBasketLocal,
  clearBasketLocal,
} = basketSlice.actions;

export default basketSlice.reducer;
