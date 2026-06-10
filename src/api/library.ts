import { apiClient } from './client';
import type { PaginatedResponse } from './pagination';

export interface LibraryFilters {
  search?: string;
  author?: string;
  subject?: string;
  curriculum?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface LibraryItem {
  id: number;
  title: string;
  author: string | null;
  subject: string | null;
  curriculum: string | null;
  country: string | null;
  description: string | null;
  itemType: 'AUDIO' | 'WORD_DOC' | 'PDF' | 'BRAILLE' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LibraryResponse = PaginatedResponse<LibraryItem>;

export interface SystemBook {
  id: number;
  name: string;
  wordCompleted: boolean;
  audioCompleted: boolean;
  wordCompletedAt: string | null;
  audioCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SystemBooksResponse = PaginatedResponse<SystemBook>;

export const libraryApi = {
  getSystemBooks: (filters: Pick<LibraryFilters, 'search' | 'page' | 'limit'> = {}) =>
    apiClient
      .get<SystemBooksResponse>('/library/books', { params: filters })
      .then((r) => r.data),
  getAll: (filters: LibraryFilters = {}) =>
    apiClient.get<LibraryResponse>('/library', { params: filters }).then((r) => r.data),

  getOne: (id: number) =>
    apiClient.get(`/library/${id}`).then((r) => r.data),

  // Admin
  getAllAdmin: (
    params: Pick<LibraryFilters, 'search' | 'page' | 'limit'> = {},
  ) =>
    apiClient
      .get<LibraryResponse>('/library/admin/all', { params })
      .then((r) => r.data),

  create: (dto: any) =>
    apiClient.post('/library/admin', dto).then((r) => r.data),

  update: (id: number, dto: any) =>
    apiClient.patch(`/library/admin/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete(`/library/admin/${id}`).then((r) => r.data),
};
