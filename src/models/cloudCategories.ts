import { z } from "zod";

export interface CloudCategory {
  uuid: string;
  name: string;
  price: number;
  description: string;
}

export const createCloudCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
});

export const editPriceCategorySchema = createCloudCategorySchema.extend({
  uuid: z.string(),
});

export type CreatePriceCategoryFormData = z.infer<
  typeof createCloudCategorySchema
>;
export type EditPriceCategoryFormData = z.infer<typeof editPriceCategorySchema>;
