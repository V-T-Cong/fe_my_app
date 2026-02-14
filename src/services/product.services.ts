import api from "@/lib/axios";

export interface VariantDTO {
  id: string;
  type: string;
  price: number;
  variantName: string;
  stockQuantity: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  variants: VariantDTO[];
}

export const productService = {
  getAll: async () => {
    const response = await api.get<ProductResponse[]>("/api/products");
    return response.data;
  },
};
