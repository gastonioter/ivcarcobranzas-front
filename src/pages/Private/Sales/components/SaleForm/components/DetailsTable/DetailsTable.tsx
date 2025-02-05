import { SaleDetailItem } from "@/models/sale";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DetailsTableProps {
  onDeleteItem: (uuid: string) => void;
  details: SaleDetailItem[];
  handleUpdateDetail: (uuid: string, price: number, quantity: number) => void;
  readOnly?: boolean;
}

export default function DetailsTable({
  onDeleteItem,
  details,
  handleUpdateDetail,
  readOnly = false,
}: DetailsTableProps) {
  const columns: GridColDef[] = [
    {
      field: "delete",
      headerName: "Quitar",
      width: 80,
      renderCell: ({ row }: { row: SaleDetailItem }) => (
        <IconButton disabled={readOnly} onClick={() => onDeleteItem(row.uuid)}>
          <Delete />
        </IconButton>
      ),
    },
    { field: "product", headerName: "Producto", flex: 1 },
    { field: "quantity", headerName: "Cantidad", flex: 1, editable: true },
    { field: "price", headerName: "Precio Unitario", flex: 1, editable: true },
    { field: "total", headerName: "Total", flex: 1 },
  ];

  return (
    <DataGrid
      editMode="cell"
      rows={details}
      columns={columns}
      isCellEditable={() => !readOnly}
      disableRowSelectionOnClick
      processRowUpdate={({ uuid, price, quantity }) => {
        handleUpdateDetail(uuid, price, quantity);
      }}
      getRowId={(row) => row.uuid ?? row._id}
      onProcessRowUpdateError={() => {}}
    />
  );
}
