import { apiClient } from './client';

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
  getAll: (): Promise<Opportunity[]> =>
    apiClient.get('/opportunities').then((r) => r.data),
};
