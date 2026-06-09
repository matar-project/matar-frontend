import { apiClient } from './client';

export interface CreateVolunteerDto {
  name: string;
  phone: string;
  email?: string;
  city: string;
  interests: string[];
  preferredContact: string;
}

export const volunteersApi = {
  register: (dto: CreateVolunteerDto) =>
    apiClient.post('/volunteers', dto).then((r) => r.data),

  getAll: (page = 1, limit = 20) =>
    apiClient.get('/volunteers', { params: { page, limit } }).then((r) => r.data),

  update: (id: number, dto: { contacted?: boolean; notes?: string }) =>
    apiClient.patch(`/volunteers/${id}`, dto).then((r) => r.data),
};
