import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const handleErrorRes = (
  error: FetchBaseQueryError | SerializedError
) => {
  if ("data" in error) {
    // {detail: "Account with this email already exists."}
    if ("detail" in error.data) {
      const detail = error.data.detail as string; // Type assertion
      if (typeof detail == "string") {
      }
      if (Array.isArray(detail)) {
      }
      // Handle the error detail
    }
  }
};
