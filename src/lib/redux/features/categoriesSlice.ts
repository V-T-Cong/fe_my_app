import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

interface CategoriesState {
  items: Category[];
  initialized: boolean;
}

const initialState: CategoriesState = {
  items: [],
  initialized: false,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    initializeCategories: (state) => {
      if (!state.initialized) {
        // Initialize with common categories from existing products
        state.items = [
          { id: 1, name: "RPG", slug: "rpg", description: "Role-Playing Games", color: "#a855f7" },
          { id: 2, name: "Action", slug: "action", description: "Action Games", color: "#ef4444" },
          { id: 3, name: "Sandbox", slug: "sandbox", description: "Sandbox Games", color: "#22c55e" },
          { id: 4, name: "Adventure", slug: "adventure", description: "Adventure Games", color: "#3b82f6" },
          { id: 5, name: "Shooter", slug: "shooter", description: "Shooter Games", color: "#f97316" },
          { id: 6, name: "Sports", slug: "sports", description: "Sports Games", color: "#eab308" },
          { id: 7, name: "OS", slug: "os", description: "Operating Systems", color: "#6366f1" },
          { id: 8, name: "Productivity", slug: "productivity", description: "Productivity Software", color: "#14b8a6" },
          { id: 9, name: "Security", slug: "security", description: "Security Software", color: "#06b6d4" },
          { id: 10, name: "Creative", slug: "creative", description: "Creative Software", color: "#ec4899" },
          { id: 11, name: "Antivirus", slug: "antivirus", description: "Antivirus Software", color: "#f43f5e" },
          { id: 12, name: "Steam", slug: "steam", description: "Steam Gift Cards", color: "#64748b" },
          { id: 13, name: "PSN", slug: "psn", description: "PlayStation Network Cards", color: "#2563eb" },
          { id: 14, name: "Xbox", slug: "xbox", description: "Xbox Gift Cards", color: "#16a34a" },
          { id: 15, name: "Apple", slug: "apple", description: "Apple Gift Cards", color: "#6b7280" },
        ];
        state.initialized = true;
      }
    },

    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },

    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteCategory: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  initializeCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
