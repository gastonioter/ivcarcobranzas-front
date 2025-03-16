import { CustomGridToolbar } from "@/components";
import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { formattedCurrency } from "@/utilities/formatPrice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface ProductsForSaleTableProps {
  products: Product[];
  isLoading: boolean;
  onClickRow: ({ row }: { row: Product }) => void;
}
export default function ProductsForSaleTable({
  products,
  isLoading,
  onClickRow,
}: ProductsForSaleTableProps): JSX.Element {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    {
      field: "price",
      headerName: "Precio",
      flex: 1,
      valueFormatter: (value) => `${formattedCurrency(value)}`,
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
        toolbar: CustomGridToolbar({ placeholder: "Buscar productos" }),
      }}
      disableColumnFilter
      disableColumnSelector
      disableColumnSorting
      disableDensitySelector
      disableColumnMenu
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
