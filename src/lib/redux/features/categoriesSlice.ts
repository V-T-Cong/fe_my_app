import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { categoryService } from "@/services/category.services";
import type { Category, CategoryRequest } from "@/types";

// Re-export the Category type for use in components
export type { Category } from "@/types";

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAll();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch categories";
      return rejectWithValue(message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (data: CategoryRequest, { rejectWithValue }) => {
    try {
      return await categoryService.create(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create category";
      return rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }: { id: string; data: CategoryRequest }, { rejectWithValue }) => {
    try {
      return await categoryService.update(id, data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update category";
      return rejectWithValue(message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Keep local-only actions for optimistic updates if needed
    updateCategoryLocal: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategoryLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateCategoryLocal,
  deleteCategoryLocal,
  clearError,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
