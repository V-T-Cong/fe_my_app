import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
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

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!existingItem) {
        state.items.push(action.payload);
        state.totalItems = state.items.length;
      }
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalItems = state.items.length;
    },

    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
