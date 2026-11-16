/// <reference types="vite/client" />
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
});
api.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error.response?.data || { message: 'Unable to reach the server' })
);
export default api;
