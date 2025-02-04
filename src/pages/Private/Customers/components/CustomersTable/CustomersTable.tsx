import { CustomGridToolbar } from "@/components/CustomGridToolbar";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useGetCustomersQuery } from "@/services/customerApi";
import { formattedDate } from "@/utilities";
import { Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import CustomerStatusIndicator from "../CustomerStatusIndicator/CustomerStatusIndicator";
import { dialogOpenSubject$ } from "@/components/CustomDialog";
import { Customer } from "@/models/customer";

interface CustomerTableProps {
  setCustomer: (customer: Customer | null) => void;
}
function CustomersTable({ setCustomer }: CustomerTableProps): JSX.Element {
  const { data, isLoading, error } = useGetCustomersQuery();

  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  const rows: GridRowsProp = data || [];

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Nombre Completo",
      editable: false,
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
      valueFormatter: (value) => (value as string).toUpperCase(),
      editable: false,
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
      editable: false,
      valueFormatter: (value) => formattedDate(value),
      filterable: false,
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 0.5,
      filterable: false,
      editable: false,
      renderCell: (params) => (
        <CustomerStatusIndicator status={params.row.status} />
      ),
    },
    {
      field: "actions",
      renderCell: (params) => (
        <TableMenuActions
          actions={[
            {
              name: "Editar",
              onClick: () => {
                // open the dialog with the data;
                setCustomer(params.row);
                dialogOpenSubject$.setSubject = true;
              },
            },
            {
              name: "Dar de baja",
              onClick: () => {},
            },
          ]}
        />
      ),
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
      getRowId={(row) => row.uuid}
      rows={rows}
      // onRowClick={(row) => console.log(row)}
      columns={columns}
      // processRowUpdate={() => {}} // TODO: Implementar
      loading={isLoading}
      // sx={{
      //   "& .MuiDataGrid-row:hover": {
      //     cursor: "pointer",
      //   },
      // }}
    />
  );
}

export default CustomersTable;
