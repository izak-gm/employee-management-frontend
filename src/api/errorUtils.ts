import { AxiosError } from "axios";

interface BackendErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export const extractErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as BackendErrorResponse | undefined;

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    // No response body at all (network failure, CORS issue, server down)
    if (!err.response)
      return "Unable to reach the server. Please check your connection and try again.";
  }
  return fallback;
};
