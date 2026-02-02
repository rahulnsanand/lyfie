import axios from 'axios';

// 1. Create the instance
const api = axios.create({
  baseURL: '/api', 
  withCredentials: true,
});

// 2. Request Interceptor: Automatically add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login if unauthorized
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;