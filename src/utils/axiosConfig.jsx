import axios from 'axios';
import { API_URL } from '../environment/API';

const AxiosAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
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
    // Si la API no está disponible, se maneja de forma silenciosa para activar el modo contingencia
    return Promise.reject(error);
  }
);

export default AxiosAPI;
