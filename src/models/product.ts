import { z } from "zod";
import { Category } from "./category";

export interface Product {
  uuid: string;
  name: string;
  price: number;
  code: string;
  categoryId: string;
}
export type ProducWithCategories = Product & {
  category: Category;
};

export const CreateProductSchema = z.object({
  name: z.string().nonempty(),
  price: z
    .string()
    .nonempty()
    .transform((v) => parseFloat(v)),
  categoryId: z.string().nonempty(),
});

export const EditProductSchema = CreateProductSchema.extend({
  uuid: z.string().nonempty(),
});

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;
export type EditProductFormValues = z.infer<typeof EditProductSchema>;
