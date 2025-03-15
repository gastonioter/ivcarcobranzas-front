import { z } from "zod";
import { Category } from "./category";

export interface Product {
  uuid: string;
  name: string;
  price: number;
  code: string;
  category: Category;
}
export type ProducWithCategories = Product & {
  category: Category;
};

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Ingresa un nombre valido"),
  price: z
    .string()
    .nonempty("Ingresa un precio")
    .transform((v) => Number(v))
    .refine((v) => v > 0, { message: "Ingresa un precio mayor a 0" }),
  categoryId: z.string().uuid().nonempty("Selecciona una categoria"),
});

export const EditProductSchema = CreateProductSchema.extend({
  uuid: z.string().nonempty(),
});

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;
export type EditProductFormValues = z.infer<typeof EditProductSchema>;
