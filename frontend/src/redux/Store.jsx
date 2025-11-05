import { configureStore } from '@reduxjs/toolkit'
import productReducer from './ProductsSlice'
import basketReducer from './BasketSlice'
import userProducer from './UserSlice'
import favoritesReducer from './FavoritesSlice'

export const store = configureStore({
  reducer: {
    products : productReducer,
    basket : basketReducer,
    user: userProducer,
    favorites: favoritesReducer,
  },
})