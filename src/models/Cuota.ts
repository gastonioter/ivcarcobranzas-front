export interface Cuota {
  uuid: string;
  status: CuotaStatus;
  amount: number;
  year: number;
  month: number;
  serie: string;
  createdAt: Date;
}

export enum CuotaStatus {
  PENDING = "PENDIENTE",
  PAID = "PAGADA",
  LATE = "ATRASADA",
}
