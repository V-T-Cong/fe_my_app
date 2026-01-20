import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      cart: cartReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
