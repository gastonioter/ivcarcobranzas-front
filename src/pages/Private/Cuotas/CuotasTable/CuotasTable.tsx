import { useGetCuotasQuery } from "@/services/cuotasApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useState } from "react";
import { CuotaStatus } from "@/models/Cuota";
import CuotasFilters from "../CuotasFilters/CuotasFilters";
export interface ICuotasTableProps {
  customerId: string;
}

export type filters = {
  year: number | "sinaplicar";
  month: number | "sinaplicar";
  status: CuotaStatus | "sinaplicar";
};
const initialFilters: filters = {
  year: new Date().getFullYear(),
  month: "sinaplicar",
  status: CuotaStatus.PENDING,
};

export default function CuotasTable({ customerId }: ICuotasTableProps) {
  const { data: cuotas } = useGetCuotasQuery(customerId);
  const [filters, setFilters] = useState<filters>(initialFilters);

  const cuotasFiltered = cuotas?.filter(
    (cuota) =>
      (filters.month !== "sinaplicar" ? cuota.month === filters.month : true) &&
      (filters.year !== "sinaplicar" ? cuota.year === filters.year : true) &&
      (filters.status !== "sinaplicar" ? cuota.status === filters.status : true)
  );
  const columns: GridColDef[] = [
    {
      field: "serie",
      headerName: "Serie",
      flex: 1,
    },
    {
      field: "fecha",
      headerName: "Fecha (MES/AÑO)",
      renderCell(params) {
        return `${params.row.month}/${params.row.year}`;
      },
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Monto",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
    },
  ];
  return cuotas && cuotas.length > 0 ? (
    <>
      <div>
        <CuotasFilters filters={filters} setFilters={setFilters} />
      </div>
      <DataGrid
        columns={columns}
        rows={cuotasFiltered}
        getRowId={(row) => row.uuid}
      ></DataGrid>
    </>
  ) : (
    <p>No hay cuotas para mostrar</p>
  );
}
