import { useGetCategoriesQuery } from "@/services/categoriesApi";
import { Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

export default function CategoriesTable() {
  const { data, isLoading, error } = useGetCategoriesQuery();

  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar las categorias</Alert>
    );
  }

  const rows: GridRowsProp = data || [];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      width: 250,
      valueFormatter: (value: string) => value.toUpperCase(),
    },
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
