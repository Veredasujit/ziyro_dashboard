import axios from "axios";
import { store } from "../Redux/store";
import { logout } from "../Redux/slices/authSlice";
import { clearTokens, setAccessToken, setRefreshToken, setSessionId } from "../utils/token";
import { setCredentials } from "../Redux/slices/authSlice";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.ziyro.in";
  
export const API = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true, // needed for refresh cookie
});

/* ================= REQUEST INTERCEPTOR ================= */

API.interceptors.request.use((config) => {
  const state = store.getState();
  const token =
    state.auth?.accessToken ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null);
console.log("token are ",token)
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


/* ============================
   AXIOS INSTANCE
============================ */
const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});



/* ============================
   RESPONSE INTERCEPTOR
   AUTO REFRESH TOKEN
============================ */
/* ================= RESPONSE (REFRESH TOKEN) ================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = store.getState().auth;
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `${BASE_URL}/api/v1/user-auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const {
          access_token,
          refresh_token,
          session_id,
          user,
        } = res.data.data;

        /* SAVE NEW TOKENS */
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setSessionId(session_id);

        store.dispatch(
          setCredentials({
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
            session_id,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (err) {
        clearTokens();
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


