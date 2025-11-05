import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addedToBasket: []
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    // Sepete ekleme / quantity artırma
    addToBasket: (state, action) => {
      const exist = state.addedToBasket.find(item => item.id === action.payload.id);
      if (exist) {
        exist.quantity += 1;
      } else {
        state.addedToBasket.push({ ...action.payload, quantity: 1 });
      }
    },

    // Quantity azaltma veya ürün silme
    decreaseQuantity: (state, action) => {
      const exist = state.addedToBasket.find(item => item.id === action.payload.id);
      if (exist) {
        if (exist.quantity > 1) {
          exist.quantity -= 1;
        } else {
          // quantity 1 ise ürünü kaldır
          state.addedToBasket = state.addedToBasket.filter(item => item.id !== action.payload.id);
        }
      }
    },

    // Ürünü direkt silme
    removeFromBasket: (state, action) => {
      state.addedToBasket = state.addedToBasket.filter(item => item.id !== action.payload.id);
    },

    // Sepeti tamamen temizleme
    clearBasket: (state) => {
      state.addedToBasket = [];
    }
  }
});

export const { addToBasket, decreaseQuantity, removeFromBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
