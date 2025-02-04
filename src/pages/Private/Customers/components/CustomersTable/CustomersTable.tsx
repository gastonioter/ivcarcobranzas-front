import { CustomGridToolbar } from "@/components/CustomGridToolbar";
import { useGetCustomersQuery } from "@/services/customerApi";
import { formattedDate } from "@/utilities";
import { Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import CustomerStatusIndicator from "../CustomerStatusIndicator/CustomerStatusIndicator";

function CustomersTable() {
  const { data, isLoading, error } = useGetCustomersQuery();

  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }
  console.log(data);
  const rows: GridRowsProp = data || [];

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Nombre Completo",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.firstName.toUpperCase() || ""} ${
          row.lastName.toUpperCase() || ""
        }`;
      },
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      sortable: false,
    },
    {
      field: "type",
      headerName: "Tipo",
      flex: 0.5,
      sortable: false,
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: false,
    },
    {
      field: "createdAt",
      headerName: "Agregado",
      flex: 0.5,
      valueFormatter: (value) => formattedDate(value),
      filterable: false,
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 0.5,
      filterable: false,
      renderCell: (params) => (
        <CustomerStatusIndicator status={params.row.status} />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      sortable: false,
      filterable: false,
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
        toolbar: CustomGridToolbar,
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

export default CustomersTable;
