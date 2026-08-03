// src/redux/services/contactApi.ts
import { apiSlice } from "../apiSlice";

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET → all contacts
    getAllContacts: builder.query<{ success: boolean; count: number; data: any[] }, void>({
      query: () => ({
        url: "/contacts/getAll-contacts",
        method: "GET",
      }),
    }),

    // GET → single contact by ID
    getContactById: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "GET",
      }),
    }),

    // DELETE → remove contact
    deleteContact: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

// Hooks
export const {
  
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useDeleteContactMutation,
} = contactApi;
