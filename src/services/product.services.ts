import api from "@/lib/axios";
import type { ProductResponse } from "@/types";

export const productService = {
  getAll: async () => {
    const response = await api.get<ProductResponse[]>("/api/products");
    return response.data;
  },
};
