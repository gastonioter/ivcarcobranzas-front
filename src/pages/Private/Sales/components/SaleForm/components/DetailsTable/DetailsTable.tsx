import { Detail } from "@/models/Transaction";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DetailsTableProps {
  onDeleteItem: (uuid: string) => void;
  details: Detail[];
  handleUpdateDetail: (detail: Detail) => void;
  readOnly?: boolean;
}

export default function DetailsTable({
  onDeleteItem,
  details,
  handleUpdateDetail,
  readOnly = false,
}: DetailsTableProps) {
  console.log(details);
  const columns: GridColDef[] = [
    {
      field: "delete",
      headerName: "Quitar",
      flex: 0.3,
      renderCell: ({ row }: { row: Detail }) => (
        <IconButton disabled={readOnly} onClick={() => onDeleteItem(row.uuid)}>
          <Delete />
        </IconButton>
      ),
    },
    { field: "product", headerName: "Producto", flex: 0.8 },
    { field: "quantity", headerName: "Cantidad", flex: 0.5, editable: true },
    {
      field: "unitPrice",
      headerName: "Precio",
      flex: 0.5,
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
      autoPageSize
      columns={columns}
      isCellEditable={() => !readOnly}
      rowHeight={40}
      hideFooterSelectedRowCount
      disableRowSelectionOnClick
      processRowUpdate={(row) => {
        const detail = row as Detail;
        handleUpdateDetail(detail);
      }}
      getRowId={(row) => row.uuid}
      onProcessRowUpdateError={() => {}}
    />
  );
}
