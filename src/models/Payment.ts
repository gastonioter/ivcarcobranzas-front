import { Cuota } from "./Cuota";

export interface Payment {
  uuid: string;
  cuotas: Cuota[];
  total: number;
  serie: string;
  createdAt: Date;
}

