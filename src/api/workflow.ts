import { apiClient } from './client';

export type RequestType = 'PDF_TO_WORD' | 'PDF_TO_AUDIO' | 'ACCOMPANIMENT';
export type CoordinatorRequestStatus =
  | 'PENDING_COORDINATOR'
  | 'COORDINATOR_ACCEPTED'
  | 'COORDINATOR_REJECTED';
export type ReservationStatus = 'IN_PROGRESS' | 'DONE' | 'REJECTED' | 'LATE';

export interface WorkflowRequest {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  requestType: RequestType;
  title: string | null;
  details: string;
  pdfFileUrl: string | null;
  pdfOriginalName: string | null;
  pdfStoredName: string | null;
  pdfMimeType: string | null;
  pdfFileSize: number | null;
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

export const workflowApi = {
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
  getCoordinatorRequests: (status?: CoordinatorRequestStatus) =>
    apiClient
      .get<WorkflowRequest[]>('/coordinator/requests', { params: { status } })
      .then((response) => response.data),
  acceptRequest: (id: number, notes?: string) =>
    apiClient
      .patch<WorkflowRequest>(`/coordinator/requests/${id}/accept`, { notes })
      .then((response) => response.data),
  rejectRequest: (id: number, reason: string) =>
    apiClient
      .patch<WorkflowRequest>(`/coordinator/requests/${id}/reject`, { reason })
      .then((response) => response.data),
  getCoordinatorReservations: (status?: ReservationStatus) =>
    apiClient
      .get<Reservation[]>('/coordinator/reservations', { params: { status } })
      .then((response) => response.data),
  getRequestReservations: (requestId: number) =>
    apiClient
      .get<Reservation[]>(`/coordinator/requests/${requestId}/reservations`)
      .then((response) => response.data),
  getCoordinatorStats: () =>
    apiClient
      .get<CoordinatorStats>('/coordinator/stats')
      .then((response) => response.data),
  getAvailableRequests: () =>
    apiClient
      .get<AvailableRequest[]>('/volunteer/available-requests')
      .then((response) => response.data),
  reservePages: (requestId: number, startPage: number, endPage: number) =>
    apiClient
      .post<Reservation>(`/volunteer/requests/${requestId}/reservations`, {
        startPage,
        endPage,
      })
      .then((response) => response.data),
  getMyReservations: () =>
    apiClient
      .get<Reservation[]>('/volunteer/my-reservations')
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
