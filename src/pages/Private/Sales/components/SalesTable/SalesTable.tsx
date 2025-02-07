import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer } from "@/models/customer";
import {
  BudgetStatus,
  SaleItemTable,
  SaleStatus,
  TransactionType,
} from "@/models/sale";
import {
  useGetSalesQuery,
  useUpdateSaleStatusMutation,
} from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Chip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router";

export default function SalesTable() {
  const { data, isLoading } = useGetSalesQuery();
  const [toggleStatus] = useUpdateSaleStatusMutation();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const actions = ({ row }: { row: SaleItemTable }) => (
    <TableMenuActions
      actions={[
        {
          name: "Gestionar Pagos",
          onClick: () => {
            if (row.status.status !== SaleStatus.CANCELLED) {
              navigate(`${"pagos"}/${row.uuid}`);
            } else {
              snackbar.openSnackbar(
                "No se puede gestionar pagos de una venta anulada",
                "error"
              );
            }
          },
        },
        {
          name: "Ver Detalle",
          onClick: () => {
            navigate(`${row.uuid}/`);
          },
        },
        {
          name: `${
            row.status.status === SaleStatus.CANCELLED ? "Activar" : "Anular"
          }`,
          onClick: async () => {
            try {
              if (
                row.status.type === TransactionType.SALE &&
                row.status.status === SaleStatus.PAID
              ) {
                snackbar.openSnackbar(
                  "No se puede anular una venta pagada",
                  "error"
                );
                return;
              }
              if (row.status.status === SaleStatus.PENDING_PAYMENT) {
                await toggleStatus({
                  uuid: row.uuid,
                  status: SaleStatus.CANCELLED,
                }).unwrap();
              } else {
                await toggleStatus({
                  uuid: row.uuid,
                  status: SaleStatus.PENDING_PAYMENT,
                }).unwrap();
              }
              snackbar.openSnackbar("Venta actualizada", "success");
            } catch (e) {
              console.log(e);
              snackbar.openSnackbar("No se pudo actualizar la venta", "error");
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

  const rows: GridRowsProp = (data || []).filter(
    (transaction) =>
      transaction.status.type === TransactionType.SALE ||
      (transaction.status.type === TransactionType.BUDGET &&
        transaction.status.status === BudgetStatus.APPROVED)
  );

  const columns: GridColDef[] = [
    { field: "serie", headerName: "Serie", flex: 1 },
    {
      field: "createdAt",
      headerName: "Fecha",
      filterable: false,
      flex: 1,
      valueFormatter: (value: string) => formattedDate(value),
    },
    {
      field: "customer",
      headerName: "Cliente",
      flex: 1,
      valueGetter: (customer: Customer) =>
        formatFullName(customer.firstName, customer.lastName),
    },
    {
      field: "seller",
      headerName: "Vendedor",
      flex: 1,
      filterable: false,
      sortable: false,
      valueGetter: (seller) => `${seller.email}`,
    },
    {
      field: "totalAmount",
      headerName: "Total",
      flex: 0.5,
      valueFormatter: (value: string) => formattedCurrency(value),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }: { row: SaleItemTable }) => (
        <Chip
          color={
            row.status.status === SaleStatus.PAID
              ? "success"
              : row.status.status === SaleStatus.PENDING_PAYMENT
              ? "warning"
              : row.status.status === SaleStatus.CANCELLED
              ? "error"
              : row.status.status === BudgetStatus.APPROVED
              ? "primary"
              : "default"
          }
          sx={{ textTransform: "capitalize" }}
          label={row.status.status}
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
    <DataGrid
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        loadingOverlay: {
          variant: "skeleton",
          noRowsVariant: "skeleton",
        },
      }}
      slots={{
        toolbar: GridToolbar,
      }}
      disableDensitySelector
      disableRowSelectionOnClick
      pagination
      disableColumnMenu
      pageSizeOptions={[10, 20, 30]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 }, // Establece la página y cantidad inicial de filas
        },
      }}
      //onPaginationModelChange={(model) => setPageSize(model.pageSize)}
      getRowId={(row) => row.uuid}
      rows={rows}
      columns={columns}
      loading={isLoading}
    />
  );
}
