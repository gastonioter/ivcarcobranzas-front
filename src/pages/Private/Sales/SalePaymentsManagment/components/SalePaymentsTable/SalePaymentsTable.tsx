import { SalePayment, SalePaymentStatuses } from "@/models";
import {
  useGetSalePaymentsQuery,
  useUpdateSalePaymentStatusMutation,
} from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "react-router";
import BlockIcon from "@mui/icons-material/Block";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useSnackbar } from "@/context/SnackbarContext";
import { formattedCurrency } from "@/utilities/formatPrice";

export default function SalePaymentsTable() {
  const snackbar = useSnackbar();
  const { uuid: saleID } = useParams();

  const [triggerChangeStatus] = useUpdateSalePaymentStatusMutation();

  function updateStatus(status: SalePaymentStatuses) {
    return async function (paymentID: string) {
      try {
        await triggerChangeStatus({
          paymentID,
          saleID: saleID as string,
          status,
        }).unwrap();

        snackbar.openSnackbar("Pago actualizado!", "info");
      } catch (e) {
        console.log(e);
        snackbar.openSnackbar("Ocurrio un error al actualizar el pago", "error");
      }
    };
  }

  const { data: payments, isLoading } = useGetSalePaymentsQuery(
    saleID as string
  );

  const rows = (payments || []).map((payment, index) => ({
    ...payment,
    nro: index + 1,
  }));

  const columns: GridColDef[] = [
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
            row.status === SalePaymentStatuses.ACTIVE ? "success" : "error"
          }`}
        />
      ),
    },
    {
      field: "action",
      headerName: "Acciones",
      width: 100,
      renderCell: ({ row }) => {
        return row.status === SalePaymentStatuses.CANCELLED ? (
          <Tooltip title="Activar Pago" arrow>
            <IconButton
              onClick={() => {
                updateStatus(SalePaymentStatuses.ACTIVE)(row.uuid);
              }}
            >
              <TaskAltIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Anular Pago" arrow>
            <IconButton
              onClick={() => {
                updateStatus(SalePaymentStatuses.CANCELLED)(row.uuid);
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
      sx={{ flexBasis: 100, flex: 2, maxWidth: "100%" }}
      getRowId={(row) => row.uuid}
    />
  );
}
