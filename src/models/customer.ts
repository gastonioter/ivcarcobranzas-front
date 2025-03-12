import { z } from "zod";
import { Cuota } from "./Cuota";
import { Payment } from "./Payment";

export type ModalidadData =
  | {
      modalidad: CustomerModalidad.CLOUD;
      cloudCategory: {
        name: string;
        price: number;
        uuid: string;
      };
      cuotas: Cuota[] | [];
      pagos: Payment[] | [];
    }
  | {
      modalidad: CustomerModalidad.REGULAR;
    };

export interface Customer {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: Date;
  cuit: string;
  modalidadData: ModalidadData;
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
export enum CloudCustomerType {
  ALTA = "alta",
  MEDIA = "media",
  BAJA = "baja",
}

/* Schemas for Inputs */

const phoneSchema = z.string().regex(/^\+?\d{10,15}$/, {
  message: "Número de teléfono inválido. Debe contener entre 10 y 15 dígitos.",
});

const LocalCustomerSchema = z.object({
  modalidad: z.literal(CustomerModalidad.REGULAR),
});

const CloudCustomerSchema = z.object({
  modalidad: z.literal(CustomerModalidad.CLOUD),
  cloudCategoryId: z
    .string()
    .uuid("Los clientes con modulo deben tener una categoria de pago")
    .nonempty("La categoria de pago es requerida"),
});

export const createCustomerSchema = z.object({
  cuit: z.string(),
  firstName: z.string().nonempty("El nombre es requerido"),
  lastName: z.string().nonempty("El apellido es requerido"),
  email: z.string().email({
    message: "Ingresa un correo electronico valido ",
  }),
  phone: phoneSchema,
  modalidadData: z.discriminatedUnion("modalidad", [
    LocalCustomerSchema,
    CloudCustomerSchema,
  ]),
});

export const editCustomerSchema = createCustomerSchema.extend({
  uuid: z.string().uuid(),
});

export const updateStatusSchema = z.object({
  uuid: z.string().uuid(),
  status: z.nativeEnum(CustomerStatus),
});
// CREATE
export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

// EDIT
export type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

// UPDATE STATUS
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
