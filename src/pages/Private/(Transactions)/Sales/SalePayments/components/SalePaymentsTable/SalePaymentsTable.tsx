import { useSnackbar } from "@/context/SnackbarContext";
import { SalePayment, SalePaymentStatus } from "@/models/SalePayment";
import {
  useGetSalePaymentsQuery,
  useUpdateSaleMutation,
} from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { formattedCurrency } from "@/utilities/formatPrice";
import BlockIcon from "@mui/icons-material/Block";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "react-router";

export default function SalePaymentsTable() {
  const snackbar = useSnackbar();
  const { uuid: saleID } = useParams();
  const [updateStatus] = useUpdateSaleMutation();
  const { data: payments, isLoading } = useGetSalePaymentsQuery(
    saleID as string
  );

  const rows = (payments || []).map((payment, index) => ({
    ...payment,
    nro: index + 1,
  }));

  const columns: GridColDef<SalePayment>[] = [
    { field: "nro", headerName: "#", width: 50 },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 0.5,
      valueFormatter: (value) => formattedDate(value),
    },
    {
      field: "amount",
      headerName: "Monto",
      flex: 1,
      valueFormatter: (value) => `${formattedCurrency(value)}`,
    },
    { field: "paymentMethod", headerName: "Metodo", flex: 1 },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }: { row: SalePayment }) => (
        <Chip
          label={`${row.status}`}
          size="small"
          color={`${
            row.status === SalePaymentStatus.ACTIVE ? "success" : "error"
          }`}
        />
      ),
    },
    {
      field: "action",
      headerName: "Acciones",
      width: 100,
      renderCell: ({ row }) => {
        return row.status === SalePaymentStatus.CANCELLED ? (
          <Tooltip title="Activar Pago" arrow>
            <IconButton
              onClick={async () => {
                await updateStatus({
                  uuid: saleID as string,
                  payment: {
                    uuid: row.uuid,
                    type: "UPDATE",
                    status: SalePaymentStatus.ACTIVE,
                  },
                });
                snackbar.openSnackbar("Pago activado!");
              }}
            >
              <TaskAltIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Anular Pago" arrow>
            <IconButton
              onClick={async () => {
                await updateStatus({
                  uuid: saleID as string,
                  payment: {
                    uuid: row.uuid,
                    type: "UPDATE",
                    status: SalePaymentStatus.CANCELLED,
                  },
                });
                snackbar.openSnackbar("Pago anulado!");
              }}
            >
              <BlockIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      loading={isLoading}
      isRowSelectable={({ row }) => !row.isCupon}
      sx={{ flexBasis: 100, flex: 2, maxWidth: "100%" }}
      getRowId={(row) => row.uuid}
    />
  );
}
