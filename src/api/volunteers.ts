import { apiClient } from './client';
import type { ListParams, PaginatedResponse } from './pagination';

export interface VolunteerUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  createdAt: string;
}

export const volunteersApi = {
  getAll: (params: ListParams = {}) =>
    apiClient
      .get<PaginatedResponse<VolunteerUser>>('/volunteers', { params })
      .then((r) => r.data),
};
