import { z } from "zod";
import { PaymentSchema, SalePayment } from "./SalePayment";
import { CreateTransactionSchema, Transaction } from "./Transaction";

export interface Sale extends Transaction {
  summary: SaleSummary;
  status: SaleStatus;
  payments: SalePayment[];
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
    .refine((val) => val > 0, {
      message: "El descuento no puede ser negativo",
    }),
});
export const EditSaleSchema = z.object({
  uuid: z.string().uuid(),
  status: z.enum(["ACTIVATE", "DEACTIVATE"]).optional(),
  payment: PaymentSchema.optional(),
});

export type UpdateSaleFormData = z.infer<typeof EditSaleSchema>;
