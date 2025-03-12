import { BASE_URL } from "@/constants/baseURL";
import { addToken } from "@/interceptors";
import {
  CreateProductFormValues,
  EditProductFormValues,
  Product,
} from "@/models/product";
import { clearCredentials } from "@/redux/slices";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: `${BASE_URL}/products`,
    prepareHeaders: addToken,
  })(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/",
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<Product, CreateProductFormValues>({
      query: (newProduct) => ({
        url: `/`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    editProduct: builder.mutation<Product, EditProductFormValues>({
      query: ({ uuid, ...updatedProductData }) => ({
        url: `/${uuid}`,
        method: "PATCH",
        body: updatedProductData,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useEditProductMutation,
} = productApi;
