import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

interface ProductsForSaleTableProps {
  products: Product[];
  isLoading: boolean;
  onClickRow: (params: any) => void;
}
export default function ProductsForSaleTable({
  products,
  isLoading,
  onClickRow,
}: ProductsForSaleTableProps): JSX.Element {
  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
    {
      field: "price",
      headerName: "Precio",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Categoria",
      valueGetter: (params) => (params as Category).name,
      flex: 1,
    },
  ];
  return (
    <DataGrid
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          printOptions: { disableToolbarButton: true },
          csvOptions: { disableToolbarButton: true },
        },
      }}
      slots={{
        toolbar: GridToolbar,
      }}
      disableColumnFilter
      disableColumnSelector
      disableColumnSorting
      disableDensitySelector
      initialState={{
        filter: {
          filterModel: {
            items: [],
          },
        },
      }}
      disableRowSelectionOnClick
      getRowId={(row) => row.uuid}
      rows={products}
      columns={columns}
      loading={isLoading}
      autoPageSize
      onRowClick={onClickRow}
      sx={{
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
      }}
    />
  );
}
