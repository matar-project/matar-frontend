import { apiClient } from './client';
import type { ListParams, PaginatedResponse } from './pagination';

export interface PublicSettings {
  whatsappLink: string | null;
  facebookLink: string | null;
  messengerLink: string | null;
  coordinatorName: string | null;
  coordinatorPhone: string | null;
}

export interface UpdateSettingsDto {
  whatsappLink?: string;
  facebookLink?: string;
  messengerLink?: string;
}

export interface Opportunity {
  id: number;
  title: string;
  description: string | null;
  subject: string | null;
  totalPages: number | null;
  remainingPages: number | null;
  status: string;
}

export interface OpportunityInput {
  title?: string;
  description?: string;
  subject?: string;
  totalPages?: number;
  remainingPages?: number;
  status?: string;
}

export const settingsApi = {
  get: () => apiClient.get<PublicSettings>('/settings').then((r) => r.data),
  update: (dto: UpdateSettingsDto) =>
    apiClient.put('/settings/admin', dto).then((r) => r.data),
};

export const opportunitiesApi = {
  getAll: (params: ListParams = {}) =>
    apiClient
      .get<PaginatedResponse<Opportunity>>('/opportunities', { params })
      .then((r) => r.data),
  create: (dto: OpportunityInput) =>
    apiClient.post('/opportunities/admin', dto).then((r) => r.data),
  update: (id: number, dto: OpportunityInput) =>
    apiClient.patch(`/opportunities/admin/${id}`, dto).then((r) => r.data),
  remove: (id: number) => apiClient.delete(`/opportunities/admin/${id}`).then((r) => r.data),
};
