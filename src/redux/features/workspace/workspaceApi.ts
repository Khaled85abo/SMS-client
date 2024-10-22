import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const workspaceApi = createApi({
    reducerPath: "workspaceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/workspaces`,
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
    tagTypes: ["Workspaces", "SingleWorkspace"],
    endpoints: (builder) => ({
        getWorkspaces: builder.query({
            query: () => "",
            providesTags: ["Workspaces"],
        }),
        getSingleWorkspace: builder.query({
            query: (workspaceId) => `/${workspaceId}`,
            providesTags: (result, error, workspaceId) => [{ type: "SingleWorkspace", id: workspaceId }],
        }),
        createWorkspace: builder.mutation({
            query: (newWorkspaceData) => ({
                url: "",
                method: "POST",
                body: newWorkspaceData,
            }),
            invalidatesTags: ["Workspaces"],
        }),
        updateWorkspace: builder.mutation({
            query: (body) => ({ url: `/${body.id}`, body: body.data, method: "PUT" }),
            invalidatesTags: (result, error, arg) => [
                "Workspaces",
                { type: "SingleWorkspace", id: arg.id },
            ],
        }),
        removeWorkspace: builder.mutation({
            query: (workspaceId) => ({ url: `/${workspaceId}`, method: "DELETE" }),
            invalidatesTags: (result, error, workspaceId) => [
                "Workspaces",
                { type: "SingleWorkspace", id: workspaceId },
            ],
        }),

    }),
});

export const {
    useGetWorkspacesQuery,
    useLazyGetSingleWorkspaceQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useRemoveWorkspaceMutation,
} = workspaceApi;


