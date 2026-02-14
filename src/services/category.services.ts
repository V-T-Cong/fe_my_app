import api from "@/lib/axios";

export interface CategoryRequest {
  name: string;
  description: string;
  color: string;
}

export interface Category {
  id: string; // UUID
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  color: string;
}

export const categoryService = {
  getAll: async () => {
    const response = await api.get<Category[]>("/api/categories");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Category>(`/api/categories/${id}`);
    return response.data;
  },

  create: async (data: CategoryRequest) => {
    const response = await api.post<Category>("/api/categories/create", null, {
      params: data,
    });
    return response.data;
  },
};
