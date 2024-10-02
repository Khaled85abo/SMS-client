import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const itemApi = createApi({
    reducerPath: "itemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/items`,
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
    tagTypes: ["Items", "SingleItem"],
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => "",
            providesTags: ["Items"],
        }),
        getSingleItem: builder.query({
            query: (itemId) => `/${itemId}`,
            providesTags: (result, error, itemId) => [{ type: "SingleItem", id: itemId }],
        }),
        createItem: builder.mutation({
            query: (newItemData) => ({
                url: "",
                method: "POST",
                body: newItemData,
            }),
            invalidatesTags: ["Items"],
        }),
        updateItem: builder.mutation({
            query: (body) => ({ url: `/${body.id}`, body: body.data, method: "PUT" }),
            invalidatesTags: (result, error, arg) => [
                "Items",
                { type: "SingleItem", id: arg.id },
            ],
        }),
        removeItem: builder.mutation({
            query: (itemId) => ({ url: `/${itemId}`, method: "DELETE" }),
            invalidatesTags: (result, error, itemId) => [
                "Items",
                { type: "SingleItem", id: itemId },
            ],
        }),

    }),
});

export const {
    useGetItemsQuery,
    useLazyGetSingleItemQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useRemoveItemMutation,
} = itemApi;


