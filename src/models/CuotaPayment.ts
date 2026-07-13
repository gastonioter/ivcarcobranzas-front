export interface PaymentLine {
  cuotaId: string;
  month: number;
  year: number;
  amount: number;
}

export interface CuotaPayment {
  uuid: string;
  customerId: string;
  lines: PaymentLine[];
  serie: string;
  createdAt: Date;
}

export interface CreatePaymentForCuotasPayload {
  customerId: string;
  cuotaIds: string[];
}
