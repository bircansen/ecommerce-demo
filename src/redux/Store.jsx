import { configureStore } from '@reduxjs/toolkit'
import productReducer from './ProductsSlice'
import basketReducer from './BasketSlice'

export const store = configureStore({
  reducer: {
    products : productReducer,
    basket : basketReducer
  },
})