import api from "@/lib/axios";
import type { Category, CategoryRequest, PageResponse } from "@/types";

export const categoryService = {

  getAll: async (page: number = 0, size: number = 10, search?: string) => {
    const response = await api.get<PageResponse<Category>>("/api/categories", {
      params: { page, size, ...(search ? { search } : {}) },
    });
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

  update: async (id: string, data: CategoryRequest) => {
    const response = await api.patch<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<Category>(`/api/categories/${id}`);
    return response.data;
  },

};