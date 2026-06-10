import { apiClient } from './client';

export interface CreateRequestDto {
  requestType: 'PDF_TO_WORD' | 'PDF_TO_AUDIO' | 'ACCOMPANIMENT';
  title: string;
  details: string;
  totalPages?: number;
}

export interface CreateBookRequestDto {
  bookTitle: string;
  author?: string;
  subject: string;
  curriculum?: string;
  academicYear?: string;
  notes?: string;
}

export const requestsApi = {
  createRequest: (dto: CreateRequestDto, pdfFile?: File) => {
    const formData = new FormData();
    formData.append('requestType', dto.requestType);
    formData.append('title', dto.title);
    formData.append('details', dto.details);
    if (dto.totalPages != null) {
      formData.append('totalPages', String(dto.totalPages));
    }
    if (pdfFile) formData.append('pdfFile', pdfFile);

    return apiClient
      .post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  },

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
