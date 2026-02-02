import api from './api';

const BASE_URL = "/auth"; // The 'api' instance already has the base URL prefix

export const authService = {
  async checkSession() {
    // Axios returns a promise with a 'data' property
    const response = await api.get(`${BASE_URL}/status`);
    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post(`${BASE_URL}/register`, { name, email, password });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post(`${BASE_URL}/logout`);
    return response.data;
  }
};  