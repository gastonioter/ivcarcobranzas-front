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
  price: z.number().positive(),
  categoryId: z.string().nonempty(),
});

export const EditProductSchema = CreateProductSchema.extend({
  uuid: z.string().nonempty(),
});

export type EditProductSchemaType = z.infer<typeof EditProductSchema>;
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
