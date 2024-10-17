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
        embedDb: builder.mutation({
            query: () => ({
                url: "populate_db",
                method: "POST",
            }),
        }),
        search: builder.mutation({
            query: () => ({
                url: "/search",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useEmbedDbMutation,
    useSearchMutation,
} = ragApi;


