import { apiClient } from './client';
import type { ListParams, PaginatedResponse } from './pagination';

export interface Opportunity {
  id: number;
  title: string;
  description?: string;
  subject?: string;
  totalPages?: number;
  remainingPages?: number;
  status: string;
  createdAt: string;
}

export const opportunitiesApi = {
  getAll: (
    params: ListParams = {},
  ): Promise<PaginatedResponse<Opportunity>> =>
    apiClient.get('/opportunities', { params }).then((r) => r.data),
  getAvailableForVolunteer: (
    params: ListParams = {},
  ): Promise<PaginatedResponse<Opportunity>> =>
    apiClient
      .get('/opportunities/volunteer', { params })
      .then((r) => r.data),
  join: (id: number) =>
    apiClient.post(`/opportunities/${id}/join`).then((r) => r.data),
};
