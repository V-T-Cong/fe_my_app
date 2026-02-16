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

// Spring Boot Page response
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
