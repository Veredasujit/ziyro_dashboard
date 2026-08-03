import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import type { RootState } from "../Redux/store"; // ✅ import RootState

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.ziyro.in";
  
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
});

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  body?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    { status?: number | string; data?: unknown }
  > =>
  async (args, api) => {
    const { url, method = "GET", data, params, headers } = args;

    try {
      const state = api.getState() as RootState;
      const token = state.auth.accessToken;

      const isFormData = data instanceof FormData;

      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  },
      });

      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError;

      return {
        error: {
          status: err.response?.status ?? "FETCH_ERROR",
          data: err.response?.data ?? err.message,
        },
      };
    }
  };


// export const axiosBaseQuery =
//   (): BaseQueryFn<
//     AxiosBaseQueryArgs,
//     unknown,
//     { status?: number | string; data?: unknown }
//   > =>
//   async (args, api) => {
//     const { url, method = "GET", data, params, headers } = args;

//     try {
//       const state = api.getState() as RootState; // ✅ NO any
//       console.log("state",state)
//       const token = state.auth.accessToken;
//       console.log("token are",token)

//       const result = await axiosInstance({
//         url,
//         method,
//         data,
//         params,
//         headers: {
//           ...(headers || {}),
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
          
//         },
//       });

//       return { data: result.data };
//     } catch (error) {
//       const err = error as AxiosError; // ✅ typed error

//       return {
//         error: {
//           status: err.response?.status ?? "FETCH_ERROR",
//           data: err.response?.data ?? err.message,
//         },
//       };
//     }
//   };
