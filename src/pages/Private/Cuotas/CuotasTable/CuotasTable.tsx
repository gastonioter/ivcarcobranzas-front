import { useGetCuotasQuery } from "@/services/cuotasApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as React from "react";

export interface ICuotasTableProps {
  customerId: string;
}

export default function CuotasTable({ customerId }: ICuotasTableProps) {
  const { data: cuotas } = useGetCuotasQuery(customerId);

  const columns: GridColDef[] = [
    {
      field: "serie",
      headerName: "Serie",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Fecha",
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
  return <DataGrid columns={columns} rows={cuotas}></DataGrid>;
}
