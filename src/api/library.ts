import { apiClient } from './client';

export interface LibraryFilters {
  search?: string;
  author?: string;
  subject?: string;
  curriculum?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export const libraryApi = {
  getAll: (filters: LibraryFilters = {}) =>
    apiClient.get('/library', { params: filters }).then((r) => r.data),

  getOne: (id: number) =>
    apiClient.get(`/library/${id}`).then((r) => r.data),

  // Admin
  getAllAdmin: (page = 1, limit = 20) =>
    apiClient.get('/library/admin/all', { params: { page, limit } }).then((r) => r.data),

  create: (dto: any) =>
    apiClient.post('/library/admin', dto).then((r) => r.data),

  update: (id: number, dto: any) =>
    apiClient.patch(`/library/admin/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete(`/library/admin/${id}`).then((r) => r.data),
};
