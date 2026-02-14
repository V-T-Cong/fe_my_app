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
