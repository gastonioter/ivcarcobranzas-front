import { addToken } from "@/interceptors";
import { clearCredentials } from "@/redux/slices";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/sales`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const sendMessagesApi = createApi({
  reducerPath: "sendMessagesApi",
  baseQuery,
  endpoints: (builder) => ({
    sendMessages: builder.mutation<any, { sendMethod?: string }>({
      query: (body) => ({
        url: `/prints`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendMessagesMutation } = sendMessagesApi;
