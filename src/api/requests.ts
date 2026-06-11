import { apiClient } from './client';

export interface CreateRequestDto {
  requestType: 'PDF_TO_WORD' | 'PDF_TO_AUDIO' | 'ACCOMPANIMENT';
  bookName?: string;
  details: string;
  totalPages?: number;
}

export const requestsApi = {
  createRequest: (dto: CreateRequestDto, pdfFile?: File) => {
    const formData = new FormData();
    formData.append('requestType', dto.requestType);
    if (dto.bookName) formData.append('bookName', dto.bookName);
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

  getMyRequests: (params: { page?: number; limit?: number } = {}) =>
    apiClient.get('/requests/my', { params }).then((r) => r.data),

  downloadOutputFile: async (requestId: number, originalName: string) => {
    const response = await apiClient.get<Blob>(`/requests/${requestId}/output`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = originalName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  },

  getStats: () =>
    apiClient.get('/stats').then((r) => r.data),

  // Admin
  getRequests: (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
  ) =>
    apiClient.get('/admin/requests', { params }).then((r) => r.data),

  updateRequest: (id: number, dto: { status?: string; notes?: string }) =>
    apiClient.patch(`/admin/requests/${id}`, dto).then((r) => r.data),
};
