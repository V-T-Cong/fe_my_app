export interface VariantDTO {
  id: string;
  type: string;
  price: number;
  variantName: string;
  stockQuantity: number;
}

export interface CreateVariantDTO {
  type: string;
  price: number;
  variantName: string;
  discountPrice: number;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  discountPercent: number;
  categoryIds: string[];
  variants: CreateVariantDTO[];
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  variants: VariantDTO[];
}
