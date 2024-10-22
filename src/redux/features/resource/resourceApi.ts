import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";
import { setWorkspaceResources } from "./resourceSlice";

export const resourceApi = createApi({
    reducerPath: "resourceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/resources`,
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
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    console.log("recieved data from getWorkspaceResources: ", data);
                    dispatch(setWorkspaceResources(data));

                } catch (error) {
                    console.log("error fetching workspace resources: ", error);
                }
            },
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
