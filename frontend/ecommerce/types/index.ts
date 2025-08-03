export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  discount: number;
  rating: number;
  category: string;
  tags: string[];
  inStock: boolean;
}