import api from "@/utils/api";
import publicApi from "../utils/publicApi";

const USERS_URL = "/users";
const PRODUCTS_URL = "/products";

class APIConfig {
  // Auth
  registerUser(registerData: any) {
    return publicApi.post(`${USERS_URL}/register/`, registerData);
  }

  login(credentials: { email: string; password: string }) {
    return publicApi.post(`${USERS_URL}/login/`, credentials); // returns JWT tokens
  }

  refreshToken(refreshToken: string) {
    return api.post(`${USERS_URL}/refresh/`, { refresh: refreshToken });
  }

  // Password management
  sendForgotPasswordOTP(email: string) {
    return publicApi.post(`${USERS_URL}/forgot-password/`, { email });
  }

  verifyOTPAndResetPassword(data: { email: string; otp: string; new_password: string }) {
    return publicApi.post(`${USERS_URL}/forgot-password/verify/`, data);
  }

  resetPassword(data: { current_password: string; new_password: string }) {
    return api.post(`${USERS_URL}/password-reset/`, data);
  }

  // Admin
  createSellerOrAdmin(userData: any) {
    return api.post(`${USERS_URL}/admin/create-seller/`, userData);
  }

  // Seller-only endpoint
  getSellerOnlyView() {
    return api.get(`${USERS_URL}/seller-only/`);
  }

  // Currency
  createCurrency(currencyData: any) {
    return api.post(`${PRODUCTS_URL}/currencies/`, currencyData);
  }

  getAllCurrencies() {
    return api.get(`${PRODUCTS_URL}/currencies/`);
  }

  // Products
  getAllProducts(params = {}) {
    return publicApi.get(`${PRODUCTS_URL}/products/`, { params });
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

  addCategory(categoryData: { name: string; description: string }) {
    return api.post(`${PRODUCTS_URL}/categories/`, categoryData);
  }

    // Purchases (for seller/admin)
  getSellerPurchases(params = {}) {
    return api.get(`${PRODUCTS_URL}/seller-purchases/`, { params });
  }

  // Orders
  placeOrder(orderData: any) {
    console.log("Sending Order Payload:", JSON.stringify(orderData, null, 2));
    return api.post(`${PRODUCTS_URL}/orders/`, orderData);
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
