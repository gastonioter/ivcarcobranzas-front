import { CustomGridToolbar } from "@/components";
import { dialogOpenSubject$ } from "@/components/CustomDialog";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, CustomerModalidad, CustomerStatus } from "@/models/customer";

import { PrivateRoutes } from "@/models";
import {
  useEditCustomerMutation,
  useGetCustomersQuery,
} from "@/services/customerApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import ClearIcon from "@mui/icons-material/Clear"; // <-- Importamos iconos de MUI
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerStatusIndicator from "../CustomerStatusIndicator/CustomerStatusIndicator";
import "./styles.module.css";

interface CustomerTableProps {
  setCustomer: (customer: Customer | null) => void;
}

function CustomersTable({ setCustomer }: CustomerTableProps): JSX.Element {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = searchParams.get("status") || undefined;
  const currentType = searchParams.get("type") || undefined;

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      cuit: false,
      email: false,
    });

  const {
    data: customers = [],
    isLoading,
    error,
  } = useGetCustomersQuery({
    status: currentStatus as CustomerStatus,
    type: currentType as CustomerModalidad,
  });

  const [editCustomerMutation] = useEditCustomerMutation();

  const handleFilterChange =
    (key: "status" | "type") => (event: SelectChangeEvent) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, event.target.value);
      setSearchParams(newParams);
    };

  const clearIndividualFilter = (key: "status" | "type") => () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("status");
    newParams.delete("type");
    setSearchParams(newParams);
  };

  const hasActiveFilters = !!currentStatus || !!currentType;

  const toggleCustomerStatus = async (row: Customer) => {
    try {
      if (row.status === CustomerStatus.ACTIVE) {
        await editCustomerMutation({
          uuid: row.uuid,
          status: CustomerStatus.INACTIVE,
        }).unwrap();
      } else {
        await editCustomerMutation({
          uuid: row.uuid,
          status: CustomerStatus.ACTIVE,
        }).unwrap();
      }
      snackbar.openSnackbar("Estado actualizado con éxito");
    } catch (e: any) {
      console.error(e);
      snackbar.openSnackbar(`${e?.data?.error || "Error"}`, "error");
    }
  };

  const actions = ({ row }: { row: Customer }) => (
    <TableMenuActions
      actions={[
        {
          name: "Ver detalle",
          onClick: () => {
            navigate(`/private/${PrivateRoutes.CUSTOMERS}/${row.uuid}`);
          },
        },
        {
          name: "Editar",
          onClick: () => {
            setCustomer(row);
            dialogOpenSubject$.setSubject = true;
          },
        },
        {
          name:
            row.status === CustomerStatus.ACTIVE
              ? "Dar de baja"
              : "Dar de alta",
          onClick: () => {
            toggleCustomerStatus(row);
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
      valueGetter: (_, row) => formatFullName(row.firstName, row.lastName),
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      minWidth: 100,
      sortable: false,
    },
    {
      field: "type",
      headerName: "Tipo",
      flex: 1,
      valueFormatter: (value: CustomerModalidad) => value?.toUpperCase(),
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
      headerName: "Registrado",
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

  if (error) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  return (
    <>
      <div>
        {/* SECCIÓN DE FILTROS */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
          {/* Filtro de Estado con botón de limpiar integrado */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={currentStatus}
              label="Estado"
              onChange={handleFilterChange("status")}
              endAdornment={
                currentStatus && (
                  <IconButton
                    size="small"
                    onClick={clearIndividualFilter("status")}
                    sx={{ marginRight: 1.5 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <MenuItem value={CustomerStatus.ACTIVE}>Activos</MenuItem>
              <MenuItem value={CustomerStatus.INACTIVE}>Inactivos</MenuItem>
            </Select>
          </FormControl>

          {/* Filtro de Tipo con botón de limpiar integrado */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="type-filter-label">Tipo</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              value={currentType}
              label="Tipo"
              onChange={handleFilterChange("type")}
              endAdornment={
                currentType && (
                  <IconButton
                    size="small"
                    onClick={clearIndividualFilter("type")}
                    sx={{ marginRight: 1.5 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <MenuItem value={CustomerModalidad.CLOUD}>Cloud</MenuItem>
              <MenuItem value={CustomerModalidad.REGULAR}>Local</MenuItem>
            </Select>
          </FormControl>

          {/* Botón para remover TODOS los filtros (solo visible si hay filtros aplicados) */}
          {hasActiveFilters && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={clearAllFilters}
              startIcon={<ClearIcon />}
            >
              Limpiar filtros
            </Button>
          )}
        </Stack>

        <DataGrid
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
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
          rows={customers}
          disableRowSelectionOnClick
          columns={columns}
          loading={isLoading}
        />
      </div>
    </>
  );
}

export default CustomersTable;
