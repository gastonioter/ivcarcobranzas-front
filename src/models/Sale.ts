import { z } from "zod";
import { PaymentSchema, SalePayment } from "./SalePayment";
import { CreateTransactionSchema, Transaction } from "./Transaction";

export interface Sale extends Transaction {
  summary: SaleSummary;
  status: SaleStatus;
  payments: SalePayment[];
  discount?: number;
}

export enum SaleStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

interface SaleSummary {
  debe: number;
  haber: number;
}

export const CreateSaleSchema = CreateTransactionSchema.extend({
  discount: z
    .string()
    .transform((val) => Number(val))
    .or(z.number())
    .refine((val) => val >= 0, {
      message: "El descuento no puede ser negativo",
    })
    .optional(),
});
export const EditSaleSchema = z.object({
  uuid: z.string().uuid(),
  status: z.enum(["ACTIVATE", "DEACTIVATE"]).optional(),
  payment: PaymentSchema.optional(),
});

export type CreateSaleFormData = z.infer<typeof CreateSaleSchema>;
export type UpdateSaleFormData = z.infer<typeof EditSaleSchema>;
