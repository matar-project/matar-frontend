import axios from 'axios';
import { logger } from '../lib/logger';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`, config.params ?? '');
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    logger.debug(`← ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status ?? 'NETWORK';
    const url = error.config?.url ?? 'unknown';
    logger.error(`← ${status} ${url}`, error.response?.data);
    return Promise.reject(error);
  },
);
