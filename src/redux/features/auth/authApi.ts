import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { setToken, setUser } from "./authSlice";
import { RootState } from "../../store";

// Define types for better type safety
interface LoginResponse {
  token: string;
  // add other response fields as needed
}

interface User {
  // define user properties
  id: string;
  email: string;
  // ... other user properties
}

interface ResetPasswordRequest {
  body: {
    password: string;
    confirmPassword: string;
  };
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.BACKEND_URL}/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      // Add required headers for CORS
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
    // Enable credentials for cross-origin requests
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    refreshToken: builder.query<LoginResponse, void>({
      query: () => ({
        url: "/users/refresh-token",
        // Ensure credentials are included for this specific endpoint
        credentials: "include",
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Refresh token received: ", data);
          dispatch(setToken(data.token));
        } catch (error) {
          console.error("Error refreshing token: ", error);
          // Handle token refresh error (e.g., logout user)
        }
      },
    }),
    me: builder.query<User, void>({
      query: () => ({
        url: "/users/me",
        credentials: "include",
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      },
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    login: builder.mutation<LoginResponse, any>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
        credentials: "include",
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Login data received: ", data);
          dispatch(setToken(data.token));
        } catch (error) {
          console.error("Error during login: ", error);
        }
      },
    }),
    resetPasswordRequest: builder.mutation({
      query: (body) => ({
        url: "/users/reset-password-request",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (request) => ({
        url: "/users/reset-password",
        method: "POST",
        body: request.body,
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
        credentials: "include",
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: () => ({
        url: "/users/verification",
        method: "POST",
        credentials: "include",
      }),
    }),


  }),
});

export const {
  useLazyRefreshTokenQuery,
  useMeQuery,
  useLazyMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useResetPasswordRequestMutation,
  useResetPasswordMutation,
  useResendVerificationEmailMutation
} = authApi;