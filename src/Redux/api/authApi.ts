import { apiSlice } from "../apiSlice";
import {
  setAccessToken,
  setRefreshToken,
  setSessionId,
  clearTokens,
} from "../../utils/token";

import {
  setCredentials,
  logout as authLogout,
} from "../slices/authSlice";

/* ================= TYPES ================= */

export interface Admin {
  adminId: string;
  fullName: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "blocked";
  isVerified: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  admin: Admin;
}

export interface AdminOtpRequest {
  email: string;
  password: string;
}

export interface VerifyAdminOtpRequest {
  email: string;
  otp: string;
}

export interface RegisterAdminRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateAdminRequest {
  adminId: string;
  fullName?: string;
  email?: string;
  status?: string;
}

export interface UpdatePasswordRequest {
  adminId: string;
  password: string;
}

/* ================= API ================= */

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= LOGIN OTP ================= */

    sendAdminLoginOtp: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      AdminOtpRequest
    >({
      query: (body) => ({
        url: "/admin/send-login-otp",
        method: "POST",
        data: body,
      }),
    }),

    /* ================= VERIFY OTP ================= */

    verifyAdminLoginOtp: builder.mutation<
      AdminAuthResponse,
      VerifyAdminOtpRequest
    >({
      query: (body) => ({
        url: "/admin/verify-login-otp",
        method: "POST",
        data: body,
      }),

      async onQueryStarted(
        _,
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data } =
            await queryFulfilled;

          setAccessToken(
            data.accessToken
          );

          setRefreshToken(
            data.refreshToken
          );

          setSessionId(
            data.sessionId
          );

          dispatch(
            setCredentials({
              user: data.admin,
              accessToken:
                data.accessToken,
              refreshToken:
                data.refreshToken,
              session_id:
                data.sessionId,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),

    /* ================= REGISTER ADMIN ================= */

    registerAdmin: builder.mutation<
      {
        success: boolean;
        message: string;
        admin: Admin;
      },
      RegisterAdminRequest
    >({
      query: (body) => ({
        url: "/admin/register",
        method: "POST",
        data: body,
      }),
    }),

    /* ================= GET ALL ADMINS ================= */

    getAllAdmins: builder.query<
      {
        success: boolean;
        totalAdmins: number;
        admins: Admin[];
      },
      void
    >({
      query: () => ({
        url: "/admin/all",
        method: "GET",
      }),
    }),

    /* ================= GET SINGLE ADMIN ================= */

    getAdminById: builder.query<
      {
        success: boolean;
        admin: Admin;
      },
      string
    >({
      query: (adminId) => ({
        url: `/admin/${adminId}`,
        method: "GET",
      }),
    }),

    /* ================= UPDATE ADMIN ================= */

    updateAdmin: builder.mutation<
      {
        success: boolean;
        message: string;
        admin: Admin;
      },
      UpdateAdminRequest
    >({
      query: ({
        adminId,
        ...body
      }) => ({
        url: `/admin/${adminId}`,
        method: "PUT",
        data: body,
      }),
    }),

    /* ================= UPDATE PASSWORD ================= */

    updateAdminPassword:
      builder.mutation<
        {
          success: boolean;
          message: string;
        },
        UpdatePasswordRequest
      >({
        query: ({
          adminId,
          password,
        }) => ({
          url: `/admin/${adminId}/password`,
          method: "PUT",
          data: {
            password,
          },
        }),
      }),

    /* ================= DELETE ADMIN ================= */

    deleteAdmin: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (adminId) => ({
        url: `/admin/${adminId}`,
        method: "DELETE",
      }),
    }),

    /* ================= LOGOUT ================= */

    adminLogout: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      void
    >({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),

      async onQueryStarted(
        _,
        { dispatch }
      ) {
        dispatch(authLogout());
        clearTokens();
      },
    }),
  }),
});

/* ================= HOOKS ================= */

export const {
  useSendAdminLoginOtpMutation,
  useVerifyAdminLoginOtpMutation,

  useRegisterAdminMutation,

  useGetAllAdminsQuery,
  useGetAdminByIdQuery,

  useUpdateAdminMutation,
  useUpdateAdminPasswordMutation,

  useDeleteAdminMutation,

  useAdminLogoutMutation,
} = adminApi;