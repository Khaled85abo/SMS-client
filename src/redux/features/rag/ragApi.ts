import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const ragApi = createApi({
    reducerPath: "ragApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/rag`,
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
    endpoints: (builder) => ({
        poppulate_db: builder.mutation({
            query: () => ({
                url: "populate_db",
                method: "POST",
            }),
        }),
        search: builder.mutation({
            query: (image) => ({
                url: "/search",
                method: "POST",
                body: image,
            }),
        }),
        OCR_light: builder.mutation({
            query: (image) => ({
                url: "/ocr-light",
                method: "POST",
                body: image,
            }),
        }),
        detect8n_img: builder.mutation({
            query: (newItemData) => ({
                url: "/detect-8x-img",
                method: "POST",
                body: newItemData,
            }),
        }),
        detect8x_img: builder.mutation({
            query: (newItemData) => ({
                url: "/detect-8x-img",
                method: "POST",
                body: newItemData,
            }),
        }),
        classify: builder.mutation({
            query: (newItemData) => ({
                url: "/classify",
                method: "POST",
                body: newItemData,
            }),
        }),


    }),
});

export const {

} = ragApi;


