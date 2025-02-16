import { dialogOpenSubject$ } from "@/components/CustomDialog";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  Customer,
  CustomerModalidad,
  CustomerStatus,
  ModalidadData,
} from "@/models/customer";
import {
  useGetCustomersQuery,
  useUpdateStatusMutation,
} from "@/services/customerApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { Alert } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import CustomerStatusIndicator from "../CustomerStatusIndicator/CustomerStatusIndicator";

function formatCustomerModalidad(data: ModalidadData) {
  return data.modalidad == CustomerModalidad.CLOUD
    ? `CLOUD - ${data.cloudCategory.name.toUpperCase()}`
    : data.modalidad;
}

interface CustomerTableProps {
  setCustomer: (customer: Customer | null) => void;
}
function CustomersTable({ setCustomer }: CustomerTableProps): JSX.Element {
  const { data, isLoading, error } = useGetCustomersQuery();
  const [changeCustomerStatus] = useUpdateStatusMutation();

  const snackbar = useSnackbar();
  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  const actions = (params) => (
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
          name: "Resumen Cta", // TODO: Implementar con filtros en la tabla Mensualidades
          onClick: () => {},
        },
        {
          name: `${
            params.row.status === CustomerStatus.ACTIVE
              ? "Dar de baja"
              : "Activar"
          }`,
          onClick: async () => {
            try {
              if (params.row.status === CustomerStatus.ACTIVE) {
                await changeCustomerStatus({
                  uuid: params.row.uuid,
                  status: CustomerStatus.INACTIVE,
                });
              } else {
                await changeCustomerStatus({
                  uuid: params.row.uuid,
                  status: CustomerStatus.ACTIVE,
                });
              }

              snackbar.openSnackbar("Estado actualizado con éxito");
            } catch (e) {
              console.log(e);
              snackbar.openSnackbar(`${e.data.error}`, "error");
            }
          },
        },
      ]}
    />
  );

  const rows: GridRowsProp = data || [];

  const columns: GridColDef<Customer>[] = [
    {
      field: "fullName",
      headerName: "Nombre Completo",
      editable: false,
      minWidth: 150,
      flex: 1,
      valueGetter: (value, row) => {
        return formatFullName(row.firstName, row.lastName);
      },
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      minWidth: 100,
      sortable: false,
    },
    {
      field: "modalidadData",
      headerName: "Tipo",
      flex: 1,
      valueFormatter: (value) => {
        const modalidadData = value as unknown as ModalidadData;
        return formatCustomerModalidad(modalidadData);
      },
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
      headerName: "Creación",
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
      renderCell: actions,
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
        toolbar: GridToolbar,
      }}
      disableDensitySelector
      disableColumnMenu
      pageSizeOptions={[5, 10, 25]}
      getRowId={(row) => row.uuid}
      rows={rows}
      disableRowSelectionOnClick
      // onRowClick={(row) => console.log(row)}
      columns={columns as GridColDef[]}
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
