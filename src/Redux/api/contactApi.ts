// src/redux/services/contactApi.ts
import { apiSlice } from "../apiSlice";

// Type definitions
export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  acceptedPrivacyPolicy: boolean;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  adminRemark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  acceptedPrivacyPolicy: boolean;
}

export interface UpdateContactRequest {
  status?: 'new' | 'in_progress' | 'resolved' | 'closed';
  adminRemark?: string;
}

export interface BulkUpdateRequest {
  contactIds: string[];
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  adminRemark?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: Contact | Contact[];
}

export interface PaginatedResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContactStats {
  success: boolean;
  data: {
    total: number;
    byStatus: Array<{
      status: string;
      count: number;
    }>;
  };
}

// API Endpoints
export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Admin: Get all contacts with pagination and filters
    getAllContacts: builder.query<PaginatedResponse, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }>({
      query: (params = {}) => ({
        url: "/contacts//getall",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status,
          search: params.search,
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'DESC',
        },
      }),
     
    }),

    // Admin: Get a single contact by ID
    getContactById: builder.query<ContactResponse, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "GET",
      }),
      
    }),

    // Admin: Get contacts by status
    getContactsByStatus: builder.query<{ success: boolean; count: number; data: Contact[] }, string>({
      query: (status) => ({
        url: `/contacts/status/${status}`,
        method: "GET",
      }),
     
    }),

    // Admin: Update contact status
    updateContactStatus: builder.mutation<ContactResponse, { id: string; data: UpdateContactRequest }>({
      query: ({ id, data }) => ({
        url: `/contacts/${id}`,
        method: "PUT",
        body: data,
      }),
      
    }),

    // Admin: Bulk update contact statuses
    bulkUpdateStatus: builder.mutation<{ success: boolean; message: string; updatedCount: number }, BulkUpdateRequest>({
      query: (data) => ({
        url: "/contacts/bulk/update",
        method: "PATCH",
        body: data,
      }),
      
    }),

    // Admin: Delete a contact
    deleteContact: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      
    }),

    // Admin: Get contact statistics
    getContactStats: builder.query<ContactStats, void>({
      query: () => ({
        url: "/contacts/stats",
        method: "GET",
      }),
      
    }),
  }),

  overrideExisting: false,
});

// Hooks
export const {
  // Admin hooks
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useGetContactsByStatusQuery,
  useUpdateContactStatusMutation,
  useBulkUpdateStatusMutation,
  useDeleteContactMutation,
  useGetContactStatsQuery,
  useLazyGetAllContactsQuery,
  useLazyGetContactByIdQuery,
  useLazyGetContactsByStatusQuery,
  useLazyGetContactStatsQuery,
} = contactApi;