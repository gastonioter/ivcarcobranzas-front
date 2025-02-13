import { TransactionFormData, Transaction } from "./Transaction";

export interface Budget extends Transaction {
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
