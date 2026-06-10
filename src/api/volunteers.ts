import { apiClient } from './client';
import type { ListParams } from './pagination';

export const volunteersApi = {
  getAll: (params: ListParams = {}) =>
    apiClient.get('/volunteers', { params }).then((r) => r.data),
};
