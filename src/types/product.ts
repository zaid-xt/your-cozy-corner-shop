export interface Review {
  id: string;
  author: string;
  comment: string | null;
  rating: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  images: string[];
  reviews: Review[];
}
