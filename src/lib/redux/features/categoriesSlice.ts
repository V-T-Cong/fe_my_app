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
          { id: 1, name: "RPG", slug: "rpg", description: "Role-Playing Games", color: "bg-purple-500" },
          { id: 2, name: "Action", slug: "action", description: "Action Games", color: "bg-red-500" },
          { id: 3, name: "Sandbox", slug: "sandbox", description: "Sandbox Games", color: "bg-green-500" },
          { id: 4, name: "Adventure", slug: "adventure", description: "Adventure Games", color: "bg-blue-500" },
          { id: 5, name: "Shooter", slug: "shooter", description: "Shooter Games", color: "bg-orange-500" },
          { id: 6, name: "Sports", slug: "sports", description: "Sports Games", color: "bg-yellow-500" },
          { id: 7, name: "OS", slug: "os", description: "Operating Systems", color: "bg-indigo-500" },
          { id: 8, name: "Productivity", slug: "productivity", description: "Productivity Software", color: "bg-teal-500" },
          { id: 9, name: "Security", slug: "security", description: "Security Software", color: "bg-cyan-500" },
          { id: 10, name: "Creative", slug: "creative", description: "Creative Software", color: "bg-pink-500" },
          { id: 11, name: "Antivirus", slug: "antivirus", description: "Antivirus Software", color: "bg-rose-500" },
          { id: 12, name: "Steam", slug: "steam", description: "Steam Gift Cards", color: "bg-slate-500" },
          { id: 13, name: "PSN", slug: "psn", description: "PlayStation Network Cards", color: "bg-blue-600" },
          { id: 14, name: "Xbox", slug: "xbox", description: "Xbox Gift Cards", color: "bg-green-600" },
          { id: 15, name: "Apple", slug: "apple", description: "Apple Gift Cards", color: "bg-gray-500" },
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
