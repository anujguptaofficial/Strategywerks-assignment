import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

export const fetchProductsByPage = createAsyncThunk(
  "products/fetchProductsByPage",
  async (page) => {
    const response = await axios.get(CONSTANTS.PRODUCTS_URL(page));
    return { products: response.data, totalPages: 10 };
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByPage.pending, (state) => {
        state.status = CONSTANTS.LOADING;
      })
      .addCase(fetchProductsByPage.fulfilled, (state, action) => {
        state.status = CONSTANTS.SUCCEEDED;
        state.items = [...state.items, ...action.payload.products];
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.status = CONSTANTS.FAILED;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
