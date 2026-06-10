import axios, { type InternalAxiosRequestConfig } from 'axios';
import { logger } from '../lib/logger';
import type { AuthSession } from '../Types/auth.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<AuthSession> | null = null;
const AUTH_ENDPOINTS_WITHOUT_REFRESH = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
];

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

function persistSession(session: AuthSession) {
  localStorage.setItem('accessToken', session.accessToken);
  localStorage.removeItem('refreshToken');
  localStorage.setItem('user', JSON.stringify(session.user));
  window.dispatchEvent(new CustomEvent('auth-session-refreshed', { detail: session }));
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-session-expired'));
}

async function refreshSession() {
  const response = await axios.post<AuthSession>(
    `${API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  persistSession(response.data);
  return response.data;
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`, config.params ?? '');
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    logger.debug(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status ?? 'NETWORK';
    const url = error.config?.url ?? 'unknown';
    logger.error(`Response error: ${status} ${url}`, error.response?.data);

    const config = error.config as RetryableRequestConfig | undefined;
    const shouldAttemptRefresh =
      status === 401 &&
      config &&
      !config._retry &&
      Boolean(localStorage.getItem('accessToken')) &&
      !AUTH_ENDPOINTS_WITHOUT_REFRESH.some((endpoint) =>
        config.url?.endsWith(endpoint),
      );

    if (shouldAttemptRefresh) {
      config._retry = true;

      try {
        refreshPromise ??= refreshSession().finally(() => {
          refreshPromise = null;
        });
        const session = await refreshPromise;
        config.headers.Authorization = `Bearer ${session.accessToken}`;
        return apiClient(config);
      } catch (refreshError) {
        clearSession();
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
