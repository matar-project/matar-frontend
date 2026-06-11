import { apiClient } from './client';
import type { ListParams, PaginatedResponse } from './pagination';

export type RequestType = 'PDF_TO_WORD' | 'PDF_TO_AUDIO' | 'ACCOMPANIMENT';
export type CoordinatorRequestStatus =
  | 'PENDING_COORDINATOR'
  | 'COORDINATOR_ACCEPTED'
  | 'COORDINATOR_REJECTED'
  | 'DONE';
export type ReservationStatus = 'IN_PROGRESS' | 'DONE' | 'REJECTED' | 'LATE';

export interface WorkflowRequest {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  requestType: RequestType;
  title: string | null;
  bookName: string | null;
  details: string;
  pdfFileUrl: string | null;
  pdfOriginalName: string | null;
  pdfStoredName: string | null;
  pdfMimeType: string | null;
  pdfFileSize: number | null;
  outputOriginalName: string | null;
  outputStoredName: string | null;
  totalPages: number | null;
  status: CoordinatorRequestStatus;
  coordinatorNotes: string | null;
  createdAt: string;
  createdByUser: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    city: string | null;
  } | null;
  _count?: { reservations: number };
  volunteerAssignment?: {
    id: number;
    status: Exclude<ReservationStatus, 'LATE'>;
    volunteer: {
      id: number;
      name: string;
      phone: string | null;
      email: string;
    };
  } | null;
  conversionBook?: {
    id: number;
    name: string;
    wordCompleted: boolean;
    audioCompleted: boolean;
    wordCompletedAt: string | null;
    audioCompletedAt: string | null;
  } | null;
  conversionProgress?: {
    completedThroughPage: number;
    totalPages: number | null;
    canApproveCompletion: boolean;
  };
}

export interface ReservedRange {
  id: number;
  startPage: number;
  endPage: number;
  status: Exclude<ReservationStatus, 'LATE'>;
  effectiveStatus: ReservationStatus;
  deadlineAt: string;
}

export interface AvailableRequest extends WorkflowRequest {
  reservedRanges: ReservedRange[];
  nextAvailablePage: number | null;
}

export interface Reservation {
  id: number;
  startPage: number;
  endPage: number;
  status: Exclude<ReservationStatus, 'LATE'>;
  effectiveStatus: ReservationStatus;
  deadlineAt: string;
  completedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  volunteer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  request: {
    id: number;
    title: string | null;
    bookName: string | null;
    requestType: RequestType;
    totalPages: number | null;
    pdfOriginalName: string | null;
  };
}

export interface CoordinatorStats {
  pendingRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
  inProgressReservations: number;
  doneReservations: number;
  lateReservations: number;
}

export interface AccompanimentAssignment {
  id: number;
  status: Exclude<ReservationStatus, 'LATE'>;
  createdAt: string;
  request: WorkflowRequest & {
    coordinator: {
      id: number;
      name: string;
      phone: string | null;
    } | null;
  };
}

export const workflowApi = {
  uploadOutputFile: (requestId: number, file: File) => {
    const formData = new FormData();
    formData.append('outputFile', file);
    return apiClient
      .post(
        `/coordinator/requests/${requestId}/output`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((r) => r.data);
  },
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
  downloadRequestPdf: async (requestId: number, originalName: string) => {
    const response = await apiClient.get<Blob>(`/requests/${requestId}/pdf`, {
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
  getCoordinatorRequests: (
    params: ListParams & { status?: CoordinatorRequestStatus } = {},
  ) =>
    apiClient
      .get<PaginatedResponse<WorkflowRequest>>('/coordinator/requests', {
        params,
      })
      .then((response) => response.data),
  acceptRequest: (id: number, notes?: string) =>
    apiClient
      .patch<WorkflowRequest>(`/coordinator/requests/${id}/accept`, { notes })
      .then((response) => response.data),
  rejectRequest: (id: number, reason: string) =>
    apiClient
      .patch<WorkflowRequest>(`/coordinator/requests/${id}/reject`, { reason })
      .then((response) => response.data),
  updateCoordinatorRequest: (
    id: number,
    dto: {
      title?: string;
      bookName?: string;
      details?: string;
      totalPages?: number;
    },
  ) =>
    apiClient
      .patch<WorkflowRequest>(`/coordinator/requests/${id}`, dto)
      .then((response) => response.data),
  approveRequestCompletion: (id: number) =>
    apiClient
      .patch<WorkflowRequest>(
        `/coordinator/requests/${id}/approve-completion`,
      )
      .then((response) => response.data),
  getRequestReservations: (requestId: number) =>
    apiClient
      .get<Reservation[]>(`/coordinator/requests/${requestId}/reservations`)
      .then((response) => response.data),
  getCoordinatorReservations: (
    params: ListParams & { status?: ReservationStatus } = {},
  ) =>
    apiClient
      .get<PaginatedResponse<Reservation>>('/coordinator/reservations', {
        params,
      })
      .then((response) => response.data),
  getCoordinatorStats: () =>
    apiClient
      .get<CoordinatorStats>('/coordinator/stats')
      .then((response) => response.data),
  getAvailableRequests: (params: ListParams = {}) =>
    apiClient
      .get<PaginatedResponse<AvailableRequest>>(
        '/volunteer/available-requests',
        { params },
      )
      .then((response) => response.data),
  reservePages: (requestId: number, endPage: number) =>
    apiClient
      .post<Reservation>(`/volunteer/requests/${requestId}/reservations`, {
        endPage,
      })
      .then((response) => response.data),
  claimAccompaniment: (requestId: number) =>
    apiClient
      .post(`/volunteer/requests/${requestId}/claim`)
      .then((response) => response.data),
  getMyAccompanimentRequests: (params: ListParams = {}) =>
    apiClient
      .get<PaginatedResponse<AccompanimentAssignment>>(
        '/volunteer/my-accompaniment-requests',
        { params },
      )
      .then((response) => response.data),
  getMyReservations: (params: ListParams = {}) =>
    apiClient
      .get<PaginatedResponse<Reservation>>('/volunteer/my-reservations', {
        params,
      })
      .then((response) => response.data),
  markReservationDone: (id: number) =>
    apiClient
      .patch<Reservation>(`/volunteer/reservations/${id}/done`)
      .then((response) => response.data),
  rejectReservation: (id: number, reason?: string) =>
    apiClient
      .patch<Reservation>(`/volunteer/reservations/${id}/reject`, { reason })
      .then((response) => response.data),
};
