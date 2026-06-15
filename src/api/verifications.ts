import { apiClient } from './client';

export interface PendingVerification {
  id: number;
  originalName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    city: string | null;
  };
}

export const verificationsApi = {
  pending: () =>
    apiClient.get<PendingVerification[]>('/admin/verifications/pending').then((response) => response.data),
  approve: (id: number) => apiClient.patch(`/admin/verifications/${id}/approve`),
  reject: (id: number, reason: string) =>
    apiClient.patch(`/admin/verifications/${id}/reject`, { reason }),
  download: (id: number) =>
    apiClient.get<Blob>(`/admin/verifications/${id}/report`, { responseType: 'blob' }),
};
