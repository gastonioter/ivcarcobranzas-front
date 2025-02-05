import { CustomGridToolbar } from "@/components/CustomGridToolbar";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer } from "@/models/customer";
import { SaleStatuses } from "@/models/sale";
import {
  useGetSalesQuery,
  useUpdateSaleStatusMutation,
} from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { Alert, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

export default function SalesTable() {
  const { data, isLoading, error } = useGetSalesQuery();
  const [toggleStatus, { error: changeStatusError, isSuccess: saleUpdated }] =
    useUpdateSaleStatusMutation();

  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const actions = (params) => (
    <TableMenuActions
      actions={[
        {
          name: "Gestionar Pagos",
          onClick: () => {},
        },
        {
          name: "Ver Detalle",
          onClick: () => {
            navigate(`${params.row.uuid}/`);
          },
        },
        {
          name: `${
            params.row.status === SaleStatuses.CANCELLED ? "Activar" : "Anular"
          }`,
          onClick: async () => {
            try {
              if (params.row.status === SaleStatuses.PAID) {
                snackbar.openSnackbar(
                  "No se puede anular una venta pagada",
                  "error"
                );
                return;
              }
              if (params.row.status === SaleStatuses.PENDING) {
                await toggleStatus({
                  uuid: params.row.uuid,
                  status: SaleStatuses.CANCELLED,
                }).unwrap();
              } else {
                await toggleStatus({
                  uuid: params.row.uuid,
                  status: SaleStatuses.PENDING,
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

  const rows: GridRowsProp = data || [];

  const columns: GridColDef[] = [
    { field: "serie", headerName: "Serie", flex: 1 },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1,
      valueFormatter: (value: string) => formattedDate(value),
    },
    {
      field: "customer",
      headerName: "Cliente",
      flex: 1,
      valueGetter: (customer: Customer) =>
        `${customer.firstName} ${customer.lastName}`,
    },
    {
      field: "seller",
      headerName: "Vendedor",
      flex: 1,
      valueGetter: (seller) => `${seller.email}`,
    },
    { field: "totalAmount", headerName: "Total", flex: 0.5 },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row: { status } }) => (
        <Chip
          color={
            status === SaleStatuses.PAID
              ? "success"
              : status === SaleStatuses.PENDING
              ? "warning"
              : "error"
          }
          label={status}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
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
        toolbar: CustomGridToolbar,
      }}
      pageSizeOptions={[5, 10, 25]}
      getRowId={(row) => row.uuid}
      rows={rows}
      columns={columns}
      loading={isLoading}
    />
  );
}
