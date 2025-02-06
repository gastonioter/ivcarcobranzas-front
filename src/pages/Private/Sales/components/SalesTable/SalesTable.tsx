import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer } from "@/models/customer";
import { SaleDetailsDTO, SaleStatuses } from "@/models/sale";
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

  const actions = ({ row: sale }: { row: SaleDetailsDTO }) => (
    <TableMenuActions
      actions={[
        {
          name: "Gestionar Pagos",
          onClick: () => {
            if (sale.status !== SaleStatuses.CANCELLED) {
              navigate(`${"pagos"}/${sale.uuid}`);
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
            navigate(`${sale.uuid}/`);
          },
        },
        {
          name: `${
            sale.status === SaleStatuses.CANCELLED ? "Activar" : "Anular"
          }`,
          onClick: async () => {
            try {
              if (sale.status === SaleStatuses.PAID) {
                snackbar.openSnackbar(
                  "No se puede anular una venta pagada",
                  "error"
                );
                return;
              }
              if (sale.status === SaleStatuses.PENDING) {
                await toggleStatus({
                  uuid: sale.uuid,
                  status: SaleStatuses.CANCELLED,
                }).unwrap();
              } else {
                await toggleStatus({
                  uuid: sale.uuid,
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
      renderCell: ({ row: { status } }) => (
        <Chip
          color={
            status === SaleStatuses.PAID
              ? "success"
              : status === SaleStatuses.PENDING
              ? "warning"
              : "error"
          }
          sx={{ textTransform: "capitalize" }}
          label={status}
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
      disableColumnMenu
      pageSizeOptions={[5, 10, 25]}
      getRowId={(row) => row.uuid}
      rows={rows}
      columns={columns}
      loading={isLoading}
    />
  );
}
