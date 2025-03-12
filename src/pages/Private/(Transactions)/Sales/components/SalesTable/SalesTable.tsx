import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer } from "@/models/customer";
import { Sale, SaleStatus } from "@/models/Sale";
import { useGetSalesQuery, useUpdateSaleMutation } from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Chip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useRef } from "react";
import { useNavigate } from "react-router";

export default function SalesTable() {
  const { data, isLoading } = useGetSalesQuery();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const newTabRef = useRef<Window | null>(null);
  const [updateSalePayment] = useUpdateSaleMutation();
  const rows = data || [];

  const openNewTab = (path: string) => {
    const url = "http://localhost:3001" + path;
    newTabRef.current = window.open(url, "_blank");
  };

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
          onClick: () => {
            openNewTab(`/api/prints/sale/${row.uuid}`);
          },
        },
      ]}
    />
  );

  const columns: GridColDef<Sale>[] = [
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
      valueGetter: (seller: { email: string }) => `${seller.email}`,
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
