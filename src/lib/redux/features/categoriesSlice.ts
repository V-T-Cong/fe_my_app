import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "@/services/category.services";
import type { Category, CategoryRequest } from "@/types";

// Re-export the Category type for use in components
export type { Category } from "@/types";

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (
    { page = 0, size = 10, search }: { page?: number; size?: number; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      return await categoryService.getAll(page, size, search);
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

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryService.delete(id);
      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete category";
      return rejectWithValue(message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all (paginated)
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.currentPage = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.pageSize = action.payload.size;
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
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        // Don't push locally — will re-fetch current page
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
      })
      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
        // Don't filter locally — will re-fetch current page
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
