import { apiSlice } from "../apiSlice";

export interface User {
  userId: string;
  user_public_id:string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin - Get All Users
    getAllUsers: builder.query<
      UsersResponse,
      void
    >({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
      }),
      
    }),

    // Admin - Delete User By UserId
    deleteUserByAdmin: builder.mutation<
      ApiResponse,
      string
    >({
      query: (userId) => ({
        url: `/user/delete-user/${userId}`,
        method: "DELETE",
      }),
      
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useDeleteUserByAdminMutation,
} = userApi;