import { CustomGridToolbar } from "@/components";
import { dialogOpenSubject$ } from "@/components/CustomDialog";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  Customer,
  CustomerModalidad,
  CustomerStatus,
  ModalidadData,
} from "@/models/customer";

import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { useSendRsmMontiWpp } from "@/hooks/useSendRsmMonitWpp";
import { PrivateRoutes } from "@/models";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateStatusMutation,
} from "@/services/customerApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { Alert, Box, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomerStatusIndicator from "../CustomerStatusIndicator/CustomerStatusIndicator";

function formatCustomerModalidad(data: ModalidadData) {
  return data.modalidad == CustomerModalidad.CLOUD
    ? `CLOUD  (${data.cloudCategory.name.toUpperCase()})`
    : data.modalidad;
}

interface CustomerTableProps {
  setCustomer: (customer: Customer | null) => void;
}
function CustomersTable({ setCustomer }: CustomerTableProps): JSX.Element {
  const { data: customers, isLoading, error } = useGetCustomersQuery();
  const [changeCustomerStatus] = useUpdateStatusMutation();
  const [deleteFn] = useDeleteCustomerMutation();
  const navigate = useNavigate();

  const [id, setId] = useState<null | string>(null);

  const [filters, setFilters] = useState({
    active: false,
    cloud: false,
  });

  const { sendWpp, sending } = useSendRsmMontiWpp(id || "");

  const toggleCustomerStatus = async (row: Customer) => {
    try {
      if (row.status === CustomerStatus.ACTIVE) {
        await changeCustomerStatus({
          uuid: row.uuid,
          status: CustomerStatus.INACTIVE,
        }).unwrap();
      } else {
        await changeCustomerStatus({
          uuid: row.uuid,
          status: CustomerStatus.ACTIVE,
        }).unwrap();
      }

      snackbar.openSnackbar("Estado actualizado con éxito");
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(`${e.data.error}`, "error");
    }
  };

  const deleteCustomer = async (uuid: string) => {
    try {
      await deleteFn(uuid).unwrap();
      snackbar.openSnackbar("Cliente eliminado!");
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(`${e.data.error}`, "error");
    }
  };

  const snackbar = useSnackbar();

  const actions = ({ row }: { row: Customer }) => (
    <TableMenuActions
      actions={[
        {
          name: "Editar",
          onClick: () => {
            // open the dialog with the data;
            setCustomer(row);
            dialogOpenSubject$.setSubject = true;
          },
        },
        {
          name: "Ver Cuotas",
          onClick: () => {
            navigate(`/private/${PrivateRoutes.CUOTAS}?customerId=${row.uuid}`);
          },
        },
        {
          name: "Ver Pagos",
          onClick: () => {
            navigate(
              `/private/${PrivateRoutes.PAYMENTS}?customerId=${row.uuid}`
            );
          },
        },

        {
          name: "Rsm. Monit.",
          onClick: () => {
            window.open(
              `${import.meta.env.VITE_BASE_API_URL}/prints/rsmmonit/${row.uuid}`
            );
          },
        },
        {
          name: "Rsm. Cta.",
          onClick: () => {
            window.open(
              `${import.meta.env.VITE_BASE_API_URL}/prints/rsmcta/${row.uuid}`
            );
          },
        },

        {
          name: "Enviar Wpp",
          onClick: async () => {
            setId(row.uuid);
          },
        },

        {
          name: `${
            row.status === CustomerStatus.ACTIVE ? "Dar de baja" : "Dar de alta"
          }`,
          onClick: async () => {
            toggleCustomerStatus(row);
          },
        },
        {
          name: "Eliminar",
          onClick: async () => {
            deleteCustomer(row.uuid);
          },
        },
      ]}
    />
  );

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
      field: "cuit",
      headerName: "CUIT",
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

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const filterCloudCustomer = (customer: Customer) =>
    customer.modalidadData.modalidad === CustomerModalidad.CLOUD;

  const filterActiveCustomer = (customer: Customer) =>
    customer.status === CustomerStatus.ACTIVE;

  const filterCustomers = useCallback(() => {
    if (!customers) return;

    let result = [...customers];

    if (filters.active) {
      result = result.filter(filterActiveCustomer);
    }

    if (filters.cloud) {
      result = result.filter(filterCloudCustomer);
    }

    setFilteredCustomers(result);
  }, [customers, filters]);

  useEffect(() => {
    filterCustomers();
  }, [filterCustomers]);

  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  return (
    <>
      <div>
        <Box sx={{ b: 2 }}>
          <FormControlLabel
            label="Solo clientes cloud"
            control={
              <Checkbox
                checked={filters.cloud}
                name="cloud"
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
          ></FormControlLabel>

          <FormControlLabel
            label="Solo clientes activos"
            control={
              <Checkbox
                checked={filters.active}
                name="active"
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
          ></FormControlLabel>
        </Box>
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
            toolbar: CustomGridToolbar({
              placeholder: "Buscar cliente por: NOMBRE, CUIT, TELEFONO, EMAIL",
            }),
          }}
          disableColumnMenu
          getRowId={(row) => row.uuid}
          rows={filteredCustomers}
          disableRowSelectionOnClick
          columns={columns as GridColDef[]}
          loading={isLoading}
        />
      </div>

      <ConfirmationDialog
        close={() => setId(null)}
        onConfirm={sendWpp}
        open={!!id}
        loading={sending}
      >
        <>
          Estas a punto de <strong>enviar el resumen de monitoreo</strong> al
          numero de WhatsApp del cliente, ¿Estás seguro de continuar?
        </>
      </ConfirmationDialog>
    </>
  );
}

export default CustomersTable;
