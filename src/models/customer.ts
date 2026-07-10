import { z } from "zod";

export interface Customer {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
  cuit: string;
  type: CustomerModalidad;
}

export interface AccountSummary {
  details: SummaryDetail[];
  debe: number;
  haber: number;
  saldo: number;
}

export interface SummaryDetail {
  saleId: string;
  debe: number;
  haber: number;
  saldo: number;
}

export enum CustomerModalidad {
  REGULAR = "Regular",
  CLOUD = "Cloud",
}

export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

/* Schemas for Inputs */

const phoneSchema = z.string().regex(/^\+?\d{10,15}$/, {
  message: "Número de teléfono inválido. Debe contener entre 10 y 15 dígitos.",
});

export const createCustomerSchema = z.object({
  cuit: z.string(),
  firstName: z.string().nonempty("El nombre es requerido"),
  lastName: z.string().nonempty("El apellido es requerido"),
  email: z.string().email({
    message: "Ingresa un correo electronico valido ",
  }),
  phone: phoneSchema,
  status: z
    .literal(CustomerStatus.ACTIVE)
    .or(z.literal(CustomerStatus.INACTIVE)),
  type: z
    .literal(CustomerModalidad.REGULAR)
    .or(z.literal(CustomerModalidad.CLOUD)),
});

export const editCustomerSchema = createCustomerSchema.partial().extend({
  uuid: z.string(),
});

// CREATE
export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

// EDIT
export type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

// UPDATE STATUS
