import { apiClient } from './client';

export const settingsApi = {
  get: () => apiClient.get('/settings').then((r) => r.data),
  update: (dto: { whatsappLink?: string; facebookLink?: string; messengerLink?: string }) =>
    apiClient.put('/settings/admin', dto).then((r) => r.data),
};

export const opportunitiesApi = {
  getAll: () => apiClient.get('/opportunities').then((r) => r.data),
  create: (dto: any) => apiClient.post('/opportunities/admin', dto).then((r) => r.data),
  update: (id: number, dto: any) => apiClient.patch(`/opportunities/admin/${id}`, dto).then((r) => r.data),
  remove: (id: number) => apiClient.delete(`/opportunities/admin/${id}`).then((r) => r.data),
};
