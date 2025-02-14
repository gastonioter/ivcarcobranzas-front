import { Detail } from "@/models/Transaction";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DetailsTableProps {
  onDeleteItem: (uuid: string) => void;
  details: Detail[];
  handleUpdateDetail: (row: Detail) => void;
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
      renderCell: ({ row }: { row: Detail }) => (
        <IconButton disabled={readOnly} onClick={() => onDeleteItem(row.uuid)}>
          <Delete />
        </IconButton>
      ),
    },
    { field: "product", headerName: "Producto", flex: 1 },
    { field: "quantity", headerName: "Cantidad", flex: 1, editable: true },
    {
      field: "unitPrice",
      headerName: "Precio Unitario",
      flex: 1,
      editable: true,
      valueFormatter: (value) => `${formattedCurrency(value)}`,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      valueFormatter: (value) => `${formattedCurrency(value)}`,
    },
  ];

  return (
    <DataGrid
      editMode="cell"
      rows={details}
      columns={columns}
      isCellEditable={() => !readOnly}
      disableRowSelectionOnClick
      processRowUpdate={(row) => {
        handleUpdateDetail({
          ...row,
        });
      }}
      getRowId={(row) => row.uuid ?? row._id}
      onProcessRowUpdateError={() => {}}
    />
  );
}
