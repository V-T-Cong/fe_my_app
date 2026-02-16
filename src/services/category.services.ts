import api from "@/lib/axios";
import type { Category, CategoryRequest } from "@/types";

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
    const response = await api.post<Category>("/api/categories/create", data);
    return response.data;
  },

  update: async (id: string, data: CategoryRequest) => {
    const response = await api.patch<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<Category>(`/api/categories/${id}`);
    return response.data;
  },

};