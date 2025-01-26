import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching products by page
export const fetchProductsByPage = createAsyncThunk(
  "products/fetchProductsByPage",
  async (page) => {
    const response = await axios.get(`https://fakestoreapi.com/products?limit=10&page=${page}`);
    return { products: response.data, totalPages: 10 }; // Assume 10 pages for this example
  }
);

// Create a slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    totalPages: 1,
  },
  reducers: {}, // No additional reducers in this example
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByPage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [...state.items, ...action.payload.products];
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer as the default export
export default productsSlice.reducer;
