import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const boxApi = createApi({
    reducerPath: "boxApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/boxes`,
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
    tagTypes: ["Boxes", "SingleBox"],
    endpoints: (builder) => ({
        getBoxes: builder.query({
            query: () => "",
            providesTags: ["Boxes"],
        }),
        getSingleBox: builder.query({
            query: (boxId) => `/${boxId}`,
            providesTags: (result, error, boxId) => [{ type: "SingleBox", id: boxId }],
        }),
        createBox: builder.mutation({
            query: (newWorkspaceData) => ({
                url: "",
                method: "POST",
                body: newWorkspaceData,
            }),
            invalidatesTags: ["Boxes"],
        }),
        updateBox: builder.mutation({
            query: (body) => ({ url: `/${body.id}`, body: body.data, method: "PUT" }),
            invalidatesTags: (result, error, arg) => [
                "Boxes",
                { type: "SingleBox", id: arg.id },
            ],
        }),
        removeBox: builder.mutation({
            query: (boxId) => ({ url: `/${boxId}`, method: "DELETE" }),
            invalidatesTags: (result, error, boxId) => [
                "Boxes",
                { type: "SingleBox", id: boxId },
            ],
        }),

    }),
});

export const {
    useGetBoxesQuery,
    useLazyGetSingleBoxQuery,
    useCreateBoxMutation,
    useUpdateBoxMutation,
    useRemoveBoxMutation,
} = boxApi;


