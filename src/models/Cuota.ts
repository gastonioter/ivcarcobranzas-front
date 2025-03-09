import { z } from "zod";

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
  NO_SERVICE = "SIN SERVICIO",
}
export enum InitalCuotaStatus {
  NO_SERVICE = "SIN SERVICIO",
  PENDING = "PENDIENTE",
}

export const createCuotaSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number(),
  year: z.number(),
  status: z.nativeEnum(CuotaStatus),
  month: z.number(),
});

export const UpdateCuotasSchema = z.object({
  cuotasId: z.array(z.string().uuid()),
  customerId: z.string().uuid(),
  status: z.nativeEnum(CuotaStatus),
});

export type UpdateCuotaPayload = z.infer<typeof UpdateCuotasSchema>;

export type CreateCuotaPayload = z.infer<typeof createCuotaSchema>;
