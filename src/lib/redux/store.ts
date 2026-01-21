import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";
import wishlistReducer from "./features/wishlistSlice";
import productsReducer from "./features/productsSlice";
import categoriesReducer from "./features/categoriesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      products: productsReducer,
      categories: categoriesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
