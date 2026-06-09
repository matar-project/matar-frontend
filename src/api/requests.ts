import { apiClient } from './client';

export interface CreateRequestDto {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  requestType: string;
  details: string;
}

export interface CreateBookRequestDto {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  bookTitle: string;
  author?: string;
  subject: string;
  country?: string;
  curriculum?: string;
  academicYear?: string;
  notes?: string;
}

export const requestsApi = {
  createRequest: (dto: CreateRequestDto) =>
    apiClient.post('/requests', dto).then((r) => r.data),

  createBookRequest: (dto: CreateBookRequestDto) =>
    apiClient.post('/book-requests', dto).then((r) => r.data),

  getStats: () =>
    apiClient.get('/stats').then((r) => r.data),

  // Admin
  getRequests: (page = 1, limit = 20, status?: string) =>
    apiClient.get('/admin/requests', { params: { page, limit, status } }).then((r) => r.data),

  getBookRequests: (page = 1, limit = 20, status?: string) =>
    apiClient.get('/admin/book-requests', { params: { page, limit, status } }).then((r) => r.data),

  updateRequest: (id: number, dto: { status?: string; notes?: string }) =>
    apiClient.patch(`/admin/requests/${id}`, dto).then((r) => r.data),

  updateBookRequest: (id: number, dto: { status?: string; notes?: string }) =>
    apiClient.patch(`/admin/book-requests/${id}`, dto).then((r) => r.data),
};
