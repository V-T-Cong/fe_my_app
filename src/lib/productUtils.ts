import {
  FEATURED_GAMES,
  FEATURED_SOFTWARE,
  NEW_ARRIVALS,
  SOFTWARE_PRODUCTS,
  GIFT_CARDS,
} from "@/lib/mockData";

// Combine all products into one array for searching
// Note: In a real app, IDs should be unique globally.
// For now, this returns the first match found.
// Transform products to add category field from categories array for compatibility
const ALL_PRODUCTS = [
  ...FEATURED_GAMES,
  ...FEATURED_SOFTWARE,
  ...NEW_ARRIVALS,
  ...SOFTWARE_PRODUCTS,
  ...GIFT_CARDS,
].map((product: any) => ({
  ...product,
  category: product.category || (product.categories && product.categories[0]) || "General",
}));

export function getProductById(id: string | number) {
  const numericId = Number(id);
  return ALL_PRODUCTS.find((product) => product.id === numericId);
}

export function getRelatedProducts(category: string, currentId: number) {
  return ALL_PRODUCTS.filter(
    (p: any) => {
      const productCategory = p.category || (p.categories && p.categories[0]);
      return productCategory === category && p.id !== currentId;
    }
  ).slice(0, 4);
}
