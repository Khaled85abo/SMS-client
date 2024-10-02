import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const workspaceApi = createApi({
    reducerPath: "workspaceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/workspaces`,
        prepareHeaders: (headers, { getState }) => {
            // Get the token from the state
            const token = (getState() as RootState).auth.token;
            // If there is a token, add it to the headers
            if (token) {
                headers.set("authorization", `bearer ${token}`);
            }
            return headers;
        },
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


