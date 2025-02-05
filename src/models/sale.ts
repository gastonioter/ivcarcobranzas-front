import { z } from "zod";

export interface Sale {
  uuid: string;
  serie: string;
  payments: SalePayment[];
  status: SaleStatuses;
  seller: string;
  customer: string;
  items: SaleDetailItem[];
  iva: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleDetailView {
  uuid: string;
  serie: string;
  payments: SalePayment[];
  status: SaleStatuses;
  seller: {
    email: string;
  };
  customer: {
    firstName: string;
    lastName: string;
  };
  items: SaleDetailItem[];
  iva: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleDetailItem {
  uuid: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

// DTO que me manda el backend
export interface SaleItemTable {
  uuid: string;
  seller: {
    email: string;
  };
  customer: {
    firstName: string;
    lastName: string;
  };
  serie: string;
  status: SaleStatuses;
  monto: number;
  createdAt: Date;
}

// DTO que me manda el backend
export interface SaleDetailsDTO {
  uuid: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  iva: number;
  items: SaleDetailItem[];
}

export enum SaleStatuses {
  PENDING = "PENDIENTE",
  PAID = "PAGO",
  CANCELLED = "CANCELADA",
}
export enum PaymentMethods {
  CASH = "CASH",
  CARD = "CARD",
  TRANSFER = "TRANSFER",
}

export interface SalePayment {
  amount: number;
  paymentMethod: PaymentMethods;
  createdAt: Date;
}

const saleDetailSchema = z.object({
  uuid: z.string(),
  product: z.string(),
  quantity: z.number().int().min(1, "La cantidad debe ser mayor a 0"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  total: z.number(),
});

export const createSaleSchema = z.object({
  seller: z.string().nonempty("Selecciona un vendedor"),
  iva: z.number().min(0, "El IVA no puede ser negativo"),
  customer: z.string().nonempty("Selecciona un cliente"),
  items: z.array(saleDetailSchema).min(1, "Agrega al menos un producto"),
});

export type CreateSaleFromData = z.infer<typeof createSaleSchema>;

export const paymentSchema = z.object({
  amount: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethods),
});

export type AddSalePaymentFormData = z.infer<typeof paymentSchema>;
