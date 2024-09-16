import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { setToken, setUser } from "./authSlice";
import { RootState } from "../../store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.BACKEND_URL}/v1`,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = (getState() as RootState).auth.token;
      // If there is a token, add it to the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => "/users/refresh-token",
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Refresh token recieved: ", data);
          dispatch(setToken(data.token));
        } catch (error) {
          console.log("error fetching login data: ", error);
        }
      },
    }),
    me: builder.query({
      query: () => "/users/me",
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        dispatch(setUser(data));
      },
    }),
    register: builder.mutation({
      query: (body) => ({ url: "/users", body, method: "POST" }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/login", method: "POST", body }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Login data recieved: ", data);
          dispatch(setToken(data.token));
        } catch (error) {
          console.log("error fetching login data: ", error);
        }
      },
    }),
    resetPasswordRequest: builder.mutation({
      query: (body) => ({
        url: "/users/reset-password-request",
        body,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (request) => ({
        url: "/users/reset-password",
        method: "POST",
        body: request.body,
        headers: {
          Authorization: `Bearer ${request.token}`,
        },
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: () => ({ url: "/users/verification", method: "POST" }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: "/profiles", body: data, method: "PUT" }),
    }),
    uploadProfileImage: builder.mutation({
      query: (data) => ({ url: "/profiles/img", body: data, method: "POST" }),
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
  useResendVerificationEmailMutation,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} = authApi;
