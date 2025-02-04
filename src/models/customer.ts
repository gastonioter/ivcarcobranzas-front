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
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  email: z.string().email().optional(),
  type: z.nativeEnum(CustomerType),
  phone: z.string().min(3).max(255),
  montoMes: z.number().optional(),
});

export const EditCustumerSchema = CreateCustomerSchema.extend({
  uuid: z.string(),
  status: z.nativeEnum(CustomerStatus),
});

export type CreateCustomerFormData = z.infer<typeof CreateCustomerSchema>;
export type EditCustomerFormData = z.infer<typeof EditCustumerSchema>;
