import { z } from "zod";

export const categorySchema = z.object({
  categoryName: z.string().min(1, "Ingresa un nombre válido"),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
