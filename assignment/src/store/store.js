import { configureStore } from '@reduxjs/toolkit';

import productsReducer from "../reducer/productsSlice"

const store = configureStore({
  reducer: {
    products: productsReducer ,
  },
});

export default store;
