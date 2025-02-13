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
