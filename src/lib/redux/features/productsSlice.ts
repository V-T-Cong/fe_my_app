import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FEATURED_GAMES,
  FEATURED_SOFTWARE,
  NEW_ARRIVALS,
  SOFTWARE_PRODUCTS,
  GIFT_CARDS,
} from "@/lib/mockData";

export interface ProductKey {
  id: string;
  key: string;
  sold: boolean;
  soldAt?: string;
  customerEmail?: string;
}

export interface ProductAccount {
  id: string;
  email: string;
  password: string;
  sold: boolean;
  soldAt?: string;
  customerEmail?: string;
}

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
  // Product types
  availableTypes: ("key" | "account")[];
  keyPrice?: string;
  accountPrice?: string;
  keys?: ProductKey[];
  accounts?: ProductAccount[];
  images?: string[];
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
        const allProducts = [
          ...FEATURED_GAMES,
          ...FEATURED_SOFTWARE,
          ...NEW_ARRIVALS,
          ...SOFTWARE_PRODUCTS,
          ...GIFT_CARDS,
        ];
        
        // Map products to include availableTypes
        state.items = allProducts.map((product: any) => ({
          ...product,
          category: product.category || (product.categories ? product.categories[0] : "General"),
          availableTypes: ["key", "account"] as ("key" | "account")[],
          keyPrice: product.price,
          accountPrice: product.originalPrice || product.price,
        }));
        
        // Add sample product keys to the first few products for demonstration
        if (state.items.length > 0) {
          // Add keys and accounts to first product
          state.items[0].keys = [
            { id: "key-1", key: "XXXX-YYYY-ZZZZ-1111", sold: true, soldAt: "2026-01-15T10:30:00Z", customerEmail: "customer1@example.com" },
            { id: "key-2", key: "XXXX-YYYY-ZZZZ-2222", sold: true, soldAt: "2026-01-18T14:20:00Z", customerEmail: "customer2@example.com" },
            { id: "key-3", key: "XXXX-YYYY-ZZZZ-3333", sold: false },
            { id: "key-4", key: "XXXX-YYYY-ZZZZ-4444", sold: false },
            { id: "key-5", key: "XXXX-YYYY-ZZZZ-5555", sold: false },
          ];
          state.items[0].accounts = [
            { id: "acc-1", email: "account1@game.com", password: "Pass123!", sold: true, soldAt: "2026-01-16T11:00:00Z", customerEmail: "buyer1@example.com" },
            { id: "acc-2", email: "account2@game.com", password: "Pass456!", sold: false },
            { id: "acc-3", email: "account3@game.com", password: "Pass789!", sold: false },
          ];
        }
        
        if (state.items.length > 1) {
          // Add keys to second product (all available)
          state.items[1].keys = [
            { id: "key-6", key: "AAAA-BBBB-CCCC-1111", sold: false },
            { id: "key-7", key: "AAAA-BBBB-CCCC-2222", sold: false },
            { id: "key-8", key: "AAAA-BBBB-CCCC-3333", sold: false },
          ];
          state.items[1].accounts = [
            { id: "acc-4", email: "account4@game.com", password: "SecurePass1!", sold: false },
            { id: "acc-5", email: "account5@game.com", password: "SecurePass2!", sold: false },
          ];
        }
        
        if (state.items.length > 2) {
          // Add keys to third product (all sold)
          state.items[2].keys = [
            { id: "key-9", key: "DDDD-EEEE-FFFF-1111", sold: true, soldAt: "2026-01-10T09:15:00Z", customerEmail: "customer3@example.com" },
            { id: "key-10", key: "DDDD-EEEE-FFFF-2222", sold: true, soldAt: "2026-01-12T16:45:00Z", customerEmail: "customer4@example.com" },
          ];
        }
        
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

    addProductKey: (
      state,
      action: PayloadAction<{ productId: number; key: ProductKey }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product) {
        if (!product.keys) {
          product.keys = [];
        }
        product.keys.push(action.payload.key);
      }
    },

    updateProductKey: (
      state,
      action: PayloadAction<{
        productId: number;
        keyId: string;
        updatedKey: ProductKey;
      }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product && product.keys) {
        const keyIndex = product.keys.findIndex(
          (k) => k.id === action.payload.keyId
        );
        if (keyIndex !== -1) {
          product.keys[keyIndex] = action.payload.updatedKey;
        }
      }
    },

    deleteProductKey: (
      state,
      action: PayloadAction<{ productId: number; keyId: string }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product && product.keys) {
        product.keys = product.keys.filter((k) => k.id !== action.payload.keyId);
      }
    },

    toggleKeySoldStatus: (
      state,
      action: PayloadAction<{
        productId: number;
        keyId: string;
        sold: boolean;
        customerEmail?: string;
      }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product && product.keys) {
        const key = product.keys.find((k) => k.id === action.payload.keyId);
        if (key) {
          key.sold = action.payload.sold;
          if (action.payload.sold) {
            key.soldAt = new Date().toISOString();
            key.customerEmail = action.payload.customerEmail;
          } else {
            key.soldAt = undefined;
            key.customerEmail = undefined;
          }
        }
      }
    },

    // Account management actions
    addProductAccount: (
      state,
      action: PayloadAction<{ productId: number; account: ProductAccount }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product) {
        if (!product.accounts) {
          product.accounts = [];
        }
        product.accounts.push(action.payload.account);
      }
    },

    updateProductAccount: (
      state,
      action: PayloadAction<{
        productId: number;
        accountId: string;
        updatedAccount: ProductAccount;
      }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product && product.accounts) {
        const accountIndex = product.accounts.findIndex(
          (a) => a.id === action.payload.accountId
        );
        if (accountIndex !== -1) {
          product.accounts[accountIndex] = action.payload.updatedAccount;
        }
      }
    },

    deleteProductAccount: (
      state,
      action: PayloadAction<{ productId: number; accountId: string }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product && product.accounts) {
        product.accounts = product.accounts.filter((a) => a.id !== action.payload.accountId);
      }
    },

    toggleAccountSoldStatus: (
      state,
      action: PayloadAction<{
        productId: number;
        accountId: string;
        sold: boolean;
        customerEmail?: string;
      }>
    ) => {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product && product.accounts) {
        const account = product.accounts.find((a) => a.id === action.payload.accountId);
        if (account) {
          account.sold = action.payload.sold;
          if (action.payload.sold) {
            account.soldAt = new Date().toISOString();
            account.customerEmail = action.payload.customerEmail;
          } else {
            account.soldAt = undefined;
            account.customerEmail = undefined;
          }
        }
      }
    },
  },
});

export const {
  initializeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addProductKey,
  updateProductKey,
  deleteProductKey,
  toggleKeySoldStatus,
  addProductAccount,
  updateProductAccount,
  deleteProductAccount,
  toggleAccountSoldStatus,
} = productsSlice.actions;
export default productsSlice.reducer;
