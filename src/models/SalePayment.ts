import { z } from "zod";

export interface SalePayment {
  uuid: string;
  amount: number;
  paymentMethod: PaymentMethods;
  status: SalePaymentStatus;
  createdAt: Date;
}

export enum PaymentMethods {
  CASH = "EFECTIVO",
  CARD = "DEBITO/CREDITO",
  TRANSFER = "TRANSFERENCIA BANCARIA",
  CHECK = "CHEQUE",
  MP = "MERCADO PAGO",
  OTHER = "OTRO",
}
export enum SalePaymentStatus {
  ACTIVE = "ACTIVO",
  CANCELLED = "ANULADO",
}

export const CreatePaymentSchema = z.object({
  type: z.literal("CREATE"),
  amount: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethods),
});

export const UpdatePaymentSchema = z.object({
  type: z.literal("UPDATE"),
  status: z.nativeEnum(SalePaymentStatus),
  uuid: z.string().uuid(), //uuid del payment a editar
});

export const PaymentSchema = z.discriminatedUnion("type", [
  CreatePaymentSchema,
  UpdatePaymentSchema,
]);
