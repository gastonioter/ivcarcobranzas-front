import { Customer } from "@/models";
import { Transaction } from "@/models/Transaction";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { formattedCurrency } from "@/utilities/formatPrice";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

interface IBaseTransactionTableProps {
  rows: Transaction[];
  columns: GridColDef[];
  isLoading: boolean;
}
export default function BaseTransactionTable({
  rows,
  columns,
  isLoading,
}: IBaseTransactionTableProps) {
  const baseColumns: GridColDef<Transaction>[] = [
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
      columns={[...baseColumns, ...columns]}
      loading={isLoading}
    />
  );
}
