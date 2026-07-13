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

export interface CuotaFilters {
  customerId?: string;
  fromMonth?: number;
  year?: number;
  status?: CuotaStatus;
}

export enum CuotaStatus {
  PENDING = "PENDIENTE",
  PAID = "PAGADA",
  NO_SERVICE = "SIN SERVICIO",
}
export enum InitalCuotaStatus {
  NO_SERVICE = "SIN SERVICIO",
  PENDING = "PENDIENTE",
}

export const cuotaMonthOpts = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const CreateCuotasSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number(),
  year: z.number(),
  status: z.nativeEnum(CuotaStatus),
  months: z.array(z.string()),
});

export const UpdateCuotaSchema = z
  .object({
    amount: z.string().transform((value) => parseFloat(value)),
  })
  .extend({ cuotaId: z.string().uuid() });

export type UpdateCuotaPayload = z.infer<typeof UpdateCuotaSchema>;

export type CreateCuotasPayload = z.infer<typeof CreateCuotasSchema>;
