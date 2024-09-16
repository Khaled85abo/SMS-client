import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config";
import {
  setCurrencies,
  setDollarPricesRates,
  setTimestamp,
} from "./currencySlice";
export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.url,
  }),
  endpoints: (builder) => ({
    getDollarPrice: builder.query({
      query: () => `/latest.json?app_id=${config.APP_ID}`,
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setDollarPricesRates(data["rates"]));
          dispatch(setTimestamp(data["timestamp"]));
        } catch (error) {
          console.log("error fetching dollar prices: ", error);
        }
      },
    }),
    getCurrencies: builder.query({
      query: () => "/currencies.json",
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrencies(data));
        } catch (error) {
          console.log("error fetching currencies: ", error);
        }
      },
    }),
  }),
});

export const { useLazyGetDollarPriceQuery, useLazyGetCurrenciesQuery } =
  currencyApi;
