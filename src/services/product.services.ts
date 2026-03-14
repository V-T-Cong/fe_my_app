import api from "@/lib/axios";
import type { ProductResponse, CreateProductRequest } from "@/types";

export const productService = {
  getAll: async () => {
    const response = await api.get<ProductResponse[]>("/api/products");
    return response.data;
  },

  create: async (data: CreateProductRequest) => {
    const response = await api.post<ProductResponse>(
      "/api/products/create",
      data
    );
    return response.data;
  },
};

