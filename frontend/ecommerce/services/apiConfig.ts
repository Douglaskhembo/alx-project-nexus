// src/services/APIConfig.ts

import api from "../utils/api";

const USERS_URL = "/users";
const PRODUCTS_URL = "/products";

class APIConfig {
  // Auth
  registerUser(registerData: any) {
    return api.post(`${USERS_URL}/register/`, registerData);
  }

  login(credentials: { email: string; password: string }) {
    return api.post(`${USERS_URL}/login/`, credentials); // returns JWT tokens
  }

  refreshToken(refreshToken: string) {
    return api.post(`${USERS_URL}/refresh/`, { refresh: refreshToken });
  }

  // Admin
  createSeller(sellerData: any) {
    return api.post(`${USERS_URL}/admin/create-seller/`, sellerData);
  }

  // Seller-only endpoint (example protected view)
  getSellerOnlyView() {
    return api.get(`${USERS_URL}/seller-only/`);
  }

  // Products
  getAllProducts(params = {}) {
    return api.get(`${PRODUCTS_URL}/products/`, { params }); // supports pagination, filters
  }

  getProductById(id: number) {
    return api.get(`${PRODUCTS_URL}/products/${id}/`);
  }

  deleteProduct(id: number) {
    return api.delete(`${PRODUCTS_URL}/products/${id}/delete/`);
  }

  // Categories
  getAllCategories() {
    return api.get(`${PRODUCTS_URL}/categories/`);
  }

  // Cart
  addToCart(data: any) {
    return api.post(`${PRODUCTS_URL}/cart/add/`, data);
  }

  removeFromCart(data: any) {
    return api.post(`${PRODUCTS_URL}/cart/remove/`, data);
  }

  addProduct(data: FormData) {
  return api.post(`${PRODUCTS_URL}/products/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

}

export default new APIConfig();
