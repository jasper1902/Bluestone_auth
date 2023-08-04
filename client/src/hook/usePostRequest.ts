/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosProgressEvent, AxiosResponse } from "axios";

type ApiResponse<T> = {
  postData: (requestData: ApiPostRequestData) => void;
  data: T | null;
  hasError: boolean;
  isLoading: boolean;
  errorMessage: string;
  status: number | null;
  statusText: string | null;
  progress: number | null;
  error: AxiosError | null;
};

type ApiPostRequestData = {
  [key: string]: any;
};

export const usePostRequest = <T>(
  url: string,
  token?: string
): [(requestData: ApiPostRequestData) => void, ApiResponse<T>] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const postData = useCallback(
    async (requestData: ApiPostRequestData): Promise<void> => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");
        setError(null);
        const response: AxiosResponse<T> = await axios.post(url, requestData, {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const timer = setTimeout(() => {
              if (progressEvent.total !== undefined) {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setProgress(progress);
              }
              clearTimeout(timer);
            }, 100);
          },
        });
        if (response.statusText === "OK" || response.statusText === "Created") {
          setData(response.data);
          setStatus(response.status);
          setStatusText(response.statusText);
          setProgress(null);
        }
        throw new Error("Server response was not ok");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error);
          setStatus(error.response?.status || null);
          setStatusText(error.response?.statusText || null);
          setHasError(true);
          setErrorMessage(error.response?.data.message || "");
        }
      } finally {
        setProgress(null);
        setIsLoading(false);
      }
    },
    [token, url]
  );
  return [
    postData,
    {
      postData,
      data,
      isLoading,
      hasError,
      errorMessage,
      status,
      statusText,
      progress,
      error,
    },
  ];
};
