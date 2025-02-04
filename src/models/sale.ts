import { z } from "zod";

export interface Sale {
  uuid: string;
  serie: string;
  payments: SalePayment[];
  status: SaleStatuses;
  seller: string;
  customer: string;
  items: SaleDetail[];
  createdAt: Date;
  updatedAt: Date;
}

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

export interface SaleDetail {
  product: string;
  quantity: number;
  price: number;
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

export const createSaleSchema = z.object({
  seller: z.string(),
  customer: z.string().nonempty("Selecciona un cliente"),
  items: z.array(
    z.object({
      product: z.string().nonempty("Agrega al menos un producto"),
      quantity: z
        .string()
        .nonempty("Ingresa una cantidad")
        .transform((v) => parseInt(v)),
      price: z
        .string()
        .nonempty("Ingresa un precio")
        .transform((v) => parseFloat(v)),
    })
  ),
});

export const paymentSchema = z.object({
  amount: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethods),
});

export type CreateSaleFromData = z.infer<typeof createSaleSchema>;

export type AddSalePaymentFormData = z.infer<typeof paymentSchema>;
