import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { setWorkspaces } from "./workspaceSlice";
import { RootState } from "../../store";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/workspaces`,
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
        getWorkspaces: builder.query({
            query: () => "",
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    console.log("user workspaces recieved: ", data);
                    dispatch(setWorkspaces(data));
                } catch (error) {
                    console.log("error fetching user workspaces: ", error);
                }
            },
        }),
        getSingleWorkspace: builder.query({
            query: (workspaceId) => `/${workspaceId}`,
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    console.log("user workspaces recieved: ", data);
                    dispatch(setWorkspaces(data));
                } catch (error) {
                    console.log("error fetching user workspaces: ", error);
                }
            },
        }),
        addWorkspace: builder.query({
            query: () => "/users/me",
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                const { data } = await queryFulfilled;
                dispatch(setUser(data));
            },
        }),
        updateWorkspace: builder.mutation({
            query: (body) => ({ url: "/users", body, method: "POST" }),
        }),
        removeWorkspace: builder.mutation({
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
