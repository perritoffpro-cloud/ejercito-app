import axios from 'axios';
import { API_URL } from '../environment/API';

const AxiosAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

AxiosAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_ejercito');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Error de conexión';
    console.error('[AxiosAPI Error]:', message);
    return Promise.reject(error);
  }
);

export default AxiosAPI;
