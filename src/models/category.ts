import { z } from "zod";

export interface Category {
  name: string;
  description: string;
  uuid: string;
}

export const categorySchema = z.object({
  name: z.string().min(1, "Ingresa una categoria válida"),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
