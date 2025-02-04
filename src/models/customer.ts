import { z } from "zod";

export interface Customer {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
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

const phoneSchema = z.string().regex(/^\+?\d{10,15}$/, {
  message: "Número de teléfono inválido. Debe contener entre 10 y 15 dígitos.",
});

export const CreateCustomerSchema = z.object({
  firstName: z.string().max(255).nonempty("El nombre es obligatorio"),
  lastName: z.string().max(255).nonempty("El apellido es obligatorio"),
  email: z
    .string()
    .email("El email no es valido")
    .nonempty("El email es obligatorio"),
  type: z.nativeEnum(CustomerType),
  phone: phoneSchema.nonempty(),
  montoMes: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "0", 10)),
});

export const EditCustumerSchema = CreateCustomerSchema.extend({
  uuid: z.string(),
});

export const BajaCustumerSchema = z.object({
  uuid: z.string(),
  status: z.nativeEnum(CustomerStatus),
});

export type CreateCustomerFormData = z.infer<typeof CreateCustomerSchema>;
export type EditCustomerFormData = z.infer<typeof EditCustumerSchema>;
export type BajaCustomerFormData = z.infer<typeof BajaCustumerSchema>;
