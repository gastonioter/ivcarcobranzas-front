import { z } from "zod";

export interface SaleEntity {
  uuid: string;
  serie: string;
  payments: PaymentEntity[];
  status: SaleStatuses;
  seller: string;
  customer: string;
  items: SaleDetailEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleDetailEntity {
  product: string;
  quantity: number;
  price: number;
}

export enum SaleStatuses {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}
export enum PaymentMethods {
  CASH = "CASH",
  CARD = "CARD",
  TRANSFER = "TRANSFER",
}

export interface PaymentEntity {
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

export type AddSalePaymentData = z.infer<typeof paymentSchema>;
