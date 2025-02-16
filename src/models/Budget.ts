import { z } from "zod";
import {
  TransactionFormData,
  Transaction,
  CreateTransactionSchema,
} from "./Transaction";

export interface Budget extends Transaction {
  status: BudgetStatus;
  expiresAt?: Date;
  approvalDate?: Date;
}

export interface BudgetFormData extends TransactionFormData {
  expiresAt?: Date;
}
export interface EditBudgetFormData {
  status: BudgetStatus;
}

export enum BudgetStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const CreateBudgetSchema = CreateTransactionSchema.extend({
  expiresAt: z.date().optional(),
});

export type UpdateBudgetFormData = { uuid: string; status: BudgetStatus };
