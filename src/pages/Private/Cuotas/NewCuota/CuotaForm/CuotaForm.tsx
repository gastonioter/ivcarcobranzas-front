import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";
import {
  CreateCuotaPayload,
  createCuotaSchema,
  InitalCuotaStatus,
} from "@/models/Cuota";
import {
  useGetCustomerQuery,
  useGetCustomersQuery,
} from "@/services/customerApi";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import CuotaPreview from "../CuotaPreview/CuotaPreview";
import { CuotaFormLayout } from "./styled-components/layout.styled.component";
import { useCreateCuotaMutation } from "@/services/cuotasApi";
import { useSnackbar } from "@/context/SnackbarContext";
import { useNavigate } from "react-router";

const yearsOpts = [
  { value: new Date().getFullYear() - 1, label: new Date().getFullYear() - 1 },
  { value: new Date().getFullYear(), label: new Date().getFullYear() },
  { value: new Date().getFullYear() + 1, label: new Date().getFullYear() + 1 },
];

const monthOpts = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];
export type newCuotaPayload = {
  year: number;
  month: number;
  amonut: number;
  status: InitalCuotaStatus;
  customer: Customer | undefined;
};

const initialCuota: newCuotaPayload = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  amonut: 0,
  status: InitalCuotaStatus.PENDING,
  customer: undefined,
};

export default function CuotaForm() {
  const [cuota, setCuota] = useState<newCuotaPayload>(initialCuota);
  const snackbar = useSnackbar();
  const {
    data,
    isLoading: isLoadingCustomers,
    error: errorCustomers,
  } = useGetCustomersQuery();

  
  const [create] = useCreateCuotaMutation();

  const navigate = useNavigate();
  const customers = data?.filter(
    (c) => c.modalidadData.modalidad === CustomerModalidad.CLOUD
  ) as Customer[];

  const handleNewCuota = async (e: SubmitEvent) => {
    e.preventDefault();
    const newCuota: CreateCuotaPayload = {
      amount: cuota.amonut,
      month: cuota.month,
      status: cuota.status,
      year: cuota.year,
      customerId: cuota.customer?.uuid as string,
    };

    const result = createCuotaSchema.safeParse(newCuota);
    if (result.success) {
      try {
        await create(newCuota).unwrap();
        snackbar.openSnackbar("Cuota creada correctamente");
        navigate(`/private/${PrivateRoutes.CUOTAS}/${newCuota.customerId}`);
      } catch (e) {
        snackbar.openSnackbar("Error al crear la cuota", "error");
        console.log(e);
      }
    } else {
      snackbar.openSnackbar("Datos invalidos", "error");
      console.log(result.error);
    }
  };
  const { data: selectedCustomer, isLoading: isLoadingSelectedCustomer } =
    useGetCustomerQuery(cuota.customer?.uuid ?? "", {
      skip: !cuota.customer?.uuid,
    });

  useEffect(() => {
    if (selectedCustomer) {
      setCuota((prev) => ({
        ...prev,
        customer: selectedCustomer,
        amonut:
          selectedCustomer.modalidadData.modalidad === CustomerModalidad.CLOUD
            ? selectedCustomer.modalidadData.cloudCategory.price
            : 0,
      }));
    }
  }, [selectedCustomer]);

  if (errorCustomers) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  return (
    <CuotaFormLayout>
      <FormControl sx={{ gridColumn: "1 / span 2" }}>
        <Autocomplete
          onChange={(event, customer) => {
            setCuota((prev) => ({ ...prev, customer }));
          }}
          disableClearable
          value={cuota.customer}
          getOptionLabel={(option: Customer) =>
            `${option.firstName} ${option.lastName}`
          }
          disabled={isLoadingCustomers}
          options={customers ?? []}
          renderInput={(params) => <TextField {...params} label="Cliente" />}
        />
      </FormControl>

      {!isLoadingSelectedCustomer && selectedCustomer && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Monto"
            type="number"
            disabled
            value={
              selectedCustomer?.modalidadData.modalidad ===
              CustomerModalidad.CLOUD
                ? selectedCustomer.modalidadData.cloudCategory.price
                : 0
            }
          ></TextField>
          <FormControl>
            <InputLabel>Mes</InputLabel>
            <Select
              label="Mes"
              value={cuota.month}
              onChange={(e) => {
                setCuota((prev) => ({
                  ...prev,
                  month: e.target.value as number,
                }));
              }}
            >
              {monthOpts.map((month) => (
                <MenuItem value={month.value}>{month.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Año</InputLabel>
            <Select
              label="Año"
              value={cuota.year}
              onChange={(e) => {
                setCuota((prev) => ({
                  ...prev,
                  year: e.target.value as number,
                }));
              }}
            >
              {yearsOpts.map((year) => (
                <MenuItem value={year.value}>{year.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={cuota.status}
              onChange={(e) => {
                setCuota((prev) => ({
                  ...prev,
                  status: e.target.value as InitalCuotaStatus,
                }));
              }}
            >
              {Object.values(InitalCuotaStatus).map((status) => (
                <MenuItem value={status}>{status.toUpperCase()}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {!isLoadingSelectedCustomer && selectedCustomer && (
        <CuotaPreview cuota={cuota} />
      )}
      {selectedCustomer && (
        <Button
          onClick={handleNewCuota}
          type="submit"
          variant="contained"
          color="success"
        >
          Confirmar
        </Button>
      )}
    </CuotaFormLayout>
  );
}
