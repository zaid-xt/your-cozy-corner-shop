export interface Review {
  id: string;
  author: string;
  comment: string | null;
  rating: number;
  created_at: string;
}

export interface ProductFabric {
  id: string;
  product_id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

export interface ProductColor {
  id: string;
  product_id: string;
  name: string;
  hex_code: string;
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
  is_special: boolean;
  special_price: number | null;
  fabrics?: ProductFabric[];
  colors?: ProductColor[];
}
