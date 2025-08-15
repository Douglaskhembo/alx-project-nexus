export interface Currency {
  id: number;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  new_price: number;
  initial_price: number;
  currency: Currency;
  discount_amount: number;
  image_url?: string | null;
  image?: string | null;
  tags: string[];
  stock: number;
  rating?: number | null;
  reviews: number;
  category: Category;
  seller: number;
  seller_name?: string;
  created_at: string;
}

interface Purchase {
  id: number;
  buyer_name: string;
  order_code: string;
  product: string;
  quantity: number;
  price: number | string;
  order_date: string;
  order_status: string;
  delivery_location: string;
  landmark: string;
  seller_name?: string;
}

// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   initial_price: number;
//   currency: {
//     id: number;
//     country_code: string;
//     country_name: string;
//     currency_code: string;
//     currency_name: string;
//   }
//   discount_amount: number;
//   new_price: number;
//   image_url?: string | null;
//   tags: string;
//   stock: number;
//   rating?: number | null;
//   reviews: number;
//   category: {
//     id: number;
//     name: string;
//     description: string;
//   };
//   seller: number;
//   seller_name?: string;
//   created_at: string;
// }