import { DeudorData } from "@/services/metricsApi";
import { formatFullName } from "@/utilities/formatFullName";
import { summarizeAmount } from "@/utilities/summarizeAmount";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

export function DeudoresTable({ deudores }: { deudores?: DeudorData[] }) {
  const navigate = useNavigate();
  return (
    <DataGrid
      rows={deudores || []}
      columns={[
        {
          field: "fullName",
          headerName: "Nombre Completo",
          editable: false,
          minWidth: 150,
          flex: 1,
          valueGetter: (value, row) => {
            return formatFullName(row.firstName, row.lastName);
          },
        },
        {
          field: "phone",
          headerName: "Teléfono",
          flex: 1,
          minWidth: 100,
          sortable: false,
        },
        {
          field: "totalOwed",
          headerName: "Deuda Total",
          flex: 1,
          valueGetter: (totalOwed: number) => {
            return summarizeAmount(totalOwed);
          },
        },
        {
          field: "Acciones",
          headerName: "Acciones",
          flex: 1,
          minWidth: 100,
          sortable: false,
          renderCell: (params) => {
            return (
              <Button
                onClick={() =>
                  navigate(
                    `/private/cuotas?customerId=${params.row.customerId}&status=PENDIENTE`,
                  )
                }
              >
                Ver Cuotas
              </Button>
            );
          },
        },
      ]}
      getRowId={(row) => row.customerId}
    />
  );
}
