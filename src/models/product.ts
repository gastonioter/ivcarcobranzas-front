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
  name: z.string().nonempty("El nombre es obligatorio"),
  price: z
    .string()
    .nonempty("El precio es obligatorio")
    .transform((val) => parseFloat(val)),
  categoryId: z.string().nonempty("La categoría es obligatoria"),
});

export const EditProductSchema = CreateProductSchema.extend({
  uuid: z.string().nonempty(),
});

export type EditProductFormValues = z.infer<typeof EditProductSchema>;

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;
