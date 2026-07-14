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
  monthStart?: number;
  monthEnd?: number;
  status?: CuotaStatus;
  year?: number;
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

export const MonthsMap = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
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
