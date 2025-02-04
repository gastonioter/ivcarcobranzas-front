import { useSnackbar } from "@/context/SnackbarContext";
import { useGetCategoriesQuery } from "@/services/categoriesApi";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

export default function CategoriesTable() {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const snackbar = useSnackbar();

  if (error) {
    snackbar.openSnackbar("Ocurrió un error al cargar las categorías", "error");
  }

  const rows: GridRowsProp = data || [];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", width: 250 },
    {
      field: "description",
      headerName: "Descripcion",
      flex: 1,
      sortable: false,
      filterable: false,
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
