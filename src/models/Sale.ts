import { z } from "zod";
import { PaymentSchema, SalePayment } from "./SalePayment";
import { Transaction } from "./Transaction";

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

export const EditSaleSchema = z.object({
  uuid: z.string().uuid(),
  status: z.enum(["ACTIVATE", "DEACTIVATE"]).optional(),
  payment: PaymentSchema.optional(),
});

export type UpdateSaleFormData = z.infer<typeof EditSaleSchema>;

// import { z } from "zod";

// export interface Transaction {
//   uuid: string;
//   serie: string;
//   payments: SalePayment[];
//   status: TransactionStatus;
//   seller: string;
//   customer: string;
//   totalAmount: number;
//   items: SaleDetailItem[];
//   createdAt: Date;
//   updatedAt: Date;
//   isBudget?: boolean;
//   iva: number;
// }

// export enum BudgetStatus {
//   PENDING_APPROVAL = "SUJETO A APROBACION",
//   APPROVED = "APROBADO",
//   REJECTED = "RECHAZADO",
// }

// export enum SaleStatus {
//   PENDING_PAYMENT = "PAGO PENDIENTE",
//   PAID = "PAGO",
//   CANCELLED = "ANULADA",
// }

// export type TransactionStatusString = `${BudgetStatus}` | `${SaleStatus}`;

// export enum TransactionType {
//   BUDGET = "BUDGET",
//   SALE = "SALE",
// }

// export type TransactionStatus =
//   | { type: TransactionType.BUDGET; status: BudgetStatus }
//   | { type: TransactionType.SALE; status: SaleStatus };

// export interface SaleDetailView {
//   uuid: string;
//   serie: string;
//   payments: SalePayment[];
//   status: SaleStatus;
//   seller: {
//     email: string;
//   };
//   customer: {
//     firstName: string;
//     lastName: string;
//   };
//   items: SaleDetailItem[];
//   iva: number;
//   total: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface SaleDetailItem {
//   uuid: string;
//   product: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

// // DTO que me manda el backend
// export interface SaleDTO {
//   payments: SalePayment[];
//   uuid: string;
//   seller: {
//     email: string;
//   };
//   customer: {
//     firstName: string;
//     lastName: string;
//   };
//   serie: string;
//   status: TransactionStatus;
//   monto: number;
//   createdAt: Date;
// }

// // DTO que me manda el backend
// export interface SaleDetailsDTO {
//   payments: SalePayment[];
//   uuid: string;
//   customer: {
//     firstName: string;
//     lastName: string;
//   };
//   iva: number;
//   items: SaleDetailItem[];
//   totalAmount: number;
//   status: TransactionStatus;
//   serie: string;
// }
// export interface SalePayment {
//   amount: number;
//   paymentMethod: PaymentMethods;
//   createdAt: Date;
//   status: SalePaymentStatuses;
// }

// export enum PaymentMethods {
//   CASH = "EFECTIVO",
//   CARD = "DEBITO/CREDITO",
//   TRANSFER = "TRANSFERENCIA BANCARIA",
//   CHECK = "CHEQUE",
//   MP = "MERCADO PAGO",
//   OTHER = "OTRO",
// }

// export enum SalePaymentStatuses {
//   ACTIVE = "ACTIVO",
//   CANCELLED = "ANULADO",
// }

// const saleDetailSchema = z.object({
//   uuid: z.string(),
//   product: z.string(),
//   quantity: z.number().int().min(1, "La cantidad debe ser mayor a 0"),
//   price: z.number().positive("El precio debe ser mayor a 0"),
//   total: z.number(),
// });

// export const createSaleSchema = z.object({
//   seller: z.string().nonempty("Selecciona un vendedor"),
//   iva: z.number().min(0, "El IVA no puede ser negativo"),
//   customer: z.string().nonempty("Selecciona un cliente"),
//   items: z.array(saleDetailSchema).min(1, "Agrega al menos un producto"),
//   isBudget: z.boolean().optional().default(false),
// });

// export const addSalePaymentSchema = z.object({
//   amount: z
//     .string()
//     .min(1, "El campo es obligatorio")
//     .refine((val) => !isNaN(Number(val)), {
//       message: "Debe ser un número válido",
//     })
//     .transform(Number)
//     .refine((val) => val > 0, {
//       message: "El número debe ser mayor a 0",
//     }),

//   paymentMethod: z.nativeEnum(PaymentMethods),
// });

// export const updateSaleStatusSchema = z.object({
//   uuid: z.string(),
//   status: z.union([z.nativeEnum(BudgetStatus), z.nativeEnum(SaleStatus)]),
// });

// export const updateSalePaymentStatusSchema = z.object({
//   uuid: z.string(),
//   status: z.nativeEnum(SalePaymentStatuses),
// });

// export type UpdateSalePaymentStatusFormData = z.infer<
//   typeof updateSaleStatusSchema
// >;

// export type UpdateSaleStatusFormData = z.infer<typeof updateSaleStatusSchema>;

// export type CreateSaleFromData = z.infer<typeof createSaleSchema>;

// export type AddSalePaymentFormData = z.infer<typeof addSalePaymentSchema>;
