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
    baseUrl: "http://localhost:3001/api/products",
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
      query: () => "/products",
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<Product, CreateProductFormValues>({
      query: (newProduct) => ({
        url: `/products`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    editProduct: builder.mutation<Product, EditProductFormValues>({
      query: ({ uuid, ...updatedProductData }) => ({
        url: `/products/${uuid}`,
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
