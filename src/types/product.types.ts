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
