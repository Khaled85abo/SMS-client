import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { setWorkspaces } from "./workspaceSlice";
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
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Workspace", "SingleWorkspace", "AddWorkspace", "UpdateWorkspace", "RemoveWorkspace"],
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
        addWorkspace: builder.mutation({
            query: (newWorkspaceData) => ({
                url: "",
                method: "POST",
                body: newWorkspaceData,
            }),
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    console.log("New workspace added:", data);

                    // Dispatch the getWorkspaces query to refresh the workspace list
                    refreshWorkspaces(dispatch);
                } catch (error) {
                    console.error("Error adding workspace:", error);
                }
            },
        }),
        updateWorkspace: builder.mutation({
            query: (body) => ({ url: "", body, method: "PUT" }),
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    console.log("Workspace updated:", data);

                    // Refresh workspaces
                    refreshWorkspaces(dispatch);
                } catch (error) {
                    console.error("Error updating workspace:", error);
                }
            }
        }),
        removeWorkspace: builder.mutation({
            query: (workspaceId) => ({ url: `/${workspaceId}`, method: "DELETE" }),
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    console.log("Workspace removed:", data);

                    // Refresh workspaces
                    refreshWorkspaces(dispatch);
                } catch (error) {
                    console.error("Error removing workspace:", error);
                }
            }
        }),

    }),
});

export const {
    useGetWorkspacesQuery,
    useLazyGetSingleWorkspaceQuery,
    useAddWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useRemoveWorkspaceMutation,
} = workspaceApi;

// Add this helper function at an appropriate place in your file
const refreshWorkspaces = (dispatch: any) => {
    dispatch(workspaceApi.endpoints.getWorkspaces.initiate({}));
};

