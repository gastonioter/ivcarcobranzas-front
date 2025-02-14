import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Sale, SaleStatus } from "@/models/Sale";
import BaseTransactionTable from "@/pages/Private/(Transactions)/components/BaseTransactionTable/BaseTransactionTable";
import { useGetSalesQuery, useUpdateSaleMutation } from "@/services/saleApi";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

export default function SalesTable() {
  const { data, isLoading } = useGetSalesQuery();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [updateSalePayment] = useUpdateSaleMutation();
  const rows = data || [];

  const actions = ({ row }: { row: Sale }) => (
    <TableMenuActions
      actions={[
        {
          name: "Gestionar Pagos",
          onClick: () => {
            navigate(`${"pagos"}/${row.uuid}`);
          },
        },
        {
          name: "Ver Detalle",
          onClick: () => {
            navigate(`${row.uuid}/`);
          },
        },
        {
          name: `${row.status === SaleStatus.CANCELLED ? "Activar" : "Anular"}`,
          onClick: async () => {
            try {
              if (row.status === SaleStatus.CANCELLED) {
                await updateSalePayment({
                  uuid: row.uuid,
                  status: "ACTIVATE",
                }).unwrap();
              } else {
                await updateSalePayment({
                  uuid: row.uuid,
                  status: "DEACTIVATE",
                }).unwrap();
              }
            } catch (e) {
              snackbar.openSnackbar(e.data.error, "error");
              console.log(e);
            }
          },
        },
        {
          name: "Imprimir",
          onClick: () => {},
        },
      ]}
    />
  );

  const columns: GridColDef[] = [
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }: { row: Sale }) => (
        <Chip
          color={
            row.status === SaleStatus.PAID
              ? "success"
              : row.status === SaleStatus.PENDING
              ? "warning"
              : "error"
          }
          sx={{ textTransform: "capitalize" }}
          label={row.status}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
      filterable: false,

      renderCell: actions,
    },
  ];

  return (
    <BaseTransactionTable columns={columns} rows={rows} isLoading={isLoading} />
  );
}
