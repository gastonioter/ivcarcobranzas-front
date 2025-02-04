import { useSnackbar } from "@/context/SnackbarContext";
import { useGetProductsQuery } from "@/services/productApi";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

export default function ProductsTable() {
  const { data, isLoading, error } = useGetProductsQuery();
  const snackbar = useSnackbar();

  if (error) {
    snackbar.openSnackbar("Ocurrió un error al cargar las categorías", "error");
  }

  const rows: GridRowsProp = data || [];
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", width: 250, flex: 1 },
    {
      field: "price",
      headerName: "Precio",
      width: 250,
    },

    {
      field: "category",
      headerName: "Categoria",
      valueGetter: (params) => params.name,
      width: 250,
    },
    {
      field: "code",
      headerName: "Codigo",
      width: 250,
    },
    { field: "actions", headerName: "Acciones", width: 100, sortable: false },
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
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
      getRowId={(row) => row.uuid}
      rows={rows}
      columns={columns}
      loading={isLoading}
    />
  );
}
