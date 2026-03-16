import api from "@/lib/axios";
import type { ProductResponse, CreateProductRequest } from "@/types";

export const productService = {
  getAll: async () => {
    const response = await api.get<ProductResponse[]>("/api/products");
    return response.data;
  },

  create: async (data: CreateProductRequest, images?: File[]) => {
    const formData = new FormData();

    // Add the product request as a JSON blob
    formData.append(
      "product",
      // Important: must be application/json type blob for Spring's @RequestPart to parse it
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    // Add image files if provided
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    // Since Axios relies on a global 'application/json' config which interferes
    // with FormData, we use the standard fetch API for this specific multipart request
    const response = await fetch("/api/proxy/api/products", {
      method: "POST",
      // We do NOT set Content-Type header manually. fetch will auto-detect FormData
      // and inject Content-Type: multipart/form-data; boundary=...
      body: formData,
    });

    if (!response.ok) {
        let msg = "Failed to create product";
        try {
            const err = await response.json();
            msg = err.message || err.error || msg;
        } catch { }
        throw new Error(msg);
    }

    return await response.json();
  },
};

