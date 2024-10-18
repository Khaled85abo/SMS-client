import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const resourceApi = createApi({
    reducerPath: "resourceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/resources`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("authorization", `bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Resources", "SingleResource"],
    endpoints: (builder) => ({
        addResource: builder.mutation({
            query: (resourceData) => ({
                url: "",
                method: "POST",
                body: resourceData,
            }),
            invalidatesTags: ["Resources"],
        }),
        getUserResources: builder.query({
            query: () => "",
            providesTags: ["Resources"],
        }),
        getWorkspaceResources: builder.query({
            query: (workspaceId) => `/workspace/${workspaceId}`,
            providesTags: ["Resources"],
        }),
        getSingleResource: builder.query({
            query: (resourceId) => `/${resourceId}`,
            providesTags: (result, error, resourceId) => [{ type: "SingleResource", id: resourceId }],
        }),
        deleteResource: builder.mutation({
            query: (resourceId) => ({
                url: `/${resourceId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, resourceId) => [{ type: "Resources", id: resourceId }],
        }),
    }),
});

export const { useAddResourceMutation, useLazyGetUserResourcesQuery, useLazyGetWorkspaceResourcesQuery, useLazyGetSingleResourceQuery, useDeleteResourceMutation } = resourceApi;
