import { dialogOpenSubject$ } from "@/components/CustomDialog";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { useGetProductsQuery } from "@/services/productApi";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface ProductsTableProps {
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}
export default function ProductsTable({
  setProduct,
}: ProductsTableProps): JSX.Element {
  const { data, isLoading, error } = useGetProductsQuery();

  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los productos</Alert>
    );
  }

  const actions = (params) => (
    <TableMenuActions
      actions={[
        {
          name: "Editar",
          onClick: () => {
            dialogOpenSubject$.setSubject = true;
            setProduct(params.row);
          },
        },
        {
          name: "Eliminar",
          onClick: () => {},
        },
      ]}
    />
  );

  const rows: GridRowsProp = data || [];
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", width: 250, flex: 1 },
    {
      field: "price",
      headerName: "Precio",
      width: 250,
      valueFormatter: (value) => `${formattedCurrency(value)}`,
    },

    {
      field: "category",
      headerName: "Categoria",
      valueGetter: (params) => (params as Category).name,
      width: 250,
    },
    {
      field: "code",
      headerName: "Codigo",
      width: 250,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      sortable: false,
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
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
      getRowId={(row) => row.uuid}
      rows={rows}
      columns={columns}
      loading={isLoading}
    />
  );
}
