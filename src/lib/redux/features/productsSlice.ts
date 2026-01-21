import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FEATURED_GAMES,
  FEATURED_SOFTWARE,
  NEW_ARRIVALS,
  SOFTWARE_PRODUCTS,
  GIFT_CARDS,
} from "@/lib/mockData";

export interface Product {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  category: string;
  color: string;
  initials: string;
}

interface ProductsState {
  items: Product[];
  initialized: boolean;
}

const initialState: ProductsState = {
  items: [],
  initialized: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    initializeProducts: (state) => {
      if (!state.initialized) {
        state.items = [
          ...FEATURED_GAMES,
          ...FEATURED_SOFTWARE,
          ...NEW_ARRIVALS,
          ...SOFTWARE_PRODUCTS,
          ...GIFT_CARDS,
        ];
        state.initialized = true;
      }
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { initializeProducts, addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
