import { z } from "zod";

export interface Customer {
  uuid: string;
  firstName: string;
  lastName: string;
  email?: string;
  type: CustomerType;
  phone: string;
  status: string;
  montoMes?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerType {
  REGULAR = "regular",
  CLOUD = "cloud",
}
export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const CreateCustomerSchema = z.object({
  firstName: z.string().max(255).nonempty("El nombre es obligatorio"),
  lastName: z.string().max(255).nonempty("El apellido es obligatorio"),
  email: z.string().optional(),
  type: z.nativeEnum(CustomerType, {
    message: "El tipo de cliente no es valido",
    required_error: "El tipo de cliente es obligatorio",
  }),
  phone: z.string().max(255).nonempty("El teléfono es obligatorio"),
  montoMes: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "0")),
});

export const EditCustumerSchema = CreateCustomerSchema.extend({
  uuid: z.string(),
  status: z.nativeEnum(CustomerStatus),
});

export type CreateCustomerFormData = z.infer<typeof CreateCustomerSchema>;
export type EditCustomerFormData = z.infer<typeof EditCustumerSchema>;
