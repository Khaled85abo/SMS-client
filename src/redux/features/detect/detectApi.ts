import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const detectApi = createApi({
    reducerPath: "detectApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/detection`,
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
    endpoints: (builder) => ({
        OCR: builder.mutation({
            query: (image) => ({
                url: "/ocr",
                method: "POST",
                body: image,
            }),
        }),
        detect_boxes_names: builder.mutation({
            query: (image) => ({
                url: "/detect-box-name",
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
    useDetect_boxes_namesMutation,
    useOCRMutation,
    useOCR_lightMutation,
    useDetect8n_imgMutation,
    useDetect8x_imgMutation,
    useClassifyMutation,
} = detectApi;


