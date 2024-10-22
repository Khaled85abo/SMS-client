import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import { RootState } from "../../store";

export const ragApi = createApi({
    reducerPath: "ragApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/rag`,
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
        embedDb: builder.mutation({
            query: () => ({
                url: "populate_db",
                method: "POST",
            }),
        }),
        search: builder.mutation({
            query: (body) => ({
                url: "/search",
                method: "POST",
                body: body,
            }),
        }),
    }),
});

export const {
    useEmbedDbMutation,
    useSearchMutation,
} = ragApi;


