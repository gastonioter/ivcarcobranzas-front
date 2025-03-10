import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";
import {
  CreateCuotaPayload,
  createCuotaSchema,
  CuotaStatus,
  InitalCuotaStatus,
} from "@/models/Cuota";
import { useCreateCuotaMutation } from "@/services/cuotasApi";
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
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CuotaPreview from "../CuotaPreview/CuotaPreview";
import { CuotaFormLayout } from "./styled-components/layout.styled.component";
import { useSearchParams } from "react-router-dom";
import { format } from "path";
import { formatFullName } from "@/utilities/formatFullName";

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
  status: CuotaStatus;
  customer: Customer | undefined;
};

const initialCuota: newCuotaPayload = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  amonut: 0,
  status: CuotaStatus.PENDING,
  customer: undefined,
};

export default function CuotaForm({ customer }: { customer?: Customer }) {
  const [cuota, setCuota] = useState<newCuotaPayload>(initialCuota);
  const [searchParams] = useSearchParams();

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

  const handleNewCuota = async (e: FormEvent<HTMLFormElement>) => {
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
        navigate(
          `/private/${PrivateRoutes.CUOTAS}?customerId=${cuota.customer?.uuid}`
        );
      } catch (e) {
        snackbar.openSnackbar(e.data.error, "error");
        console.log(e);
      }
    } else {
      snackbar.openSnackbar("Datos invalidos", "error");
      console.log(result.error);
    }
  };

  const { data: selectedCustomer, isLoading: isLoadingSelectedCustomer } =
    useGetCustomerQuery(cuota.customer?.uuid ?? "", {
      skip: !cuota.customer?.uuid || !!customer,
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

  useEffect(() => {
    if (customer) {
      setCuota((prev) => ({
        ...prev,
        customer: customer,
        amonut:
          customer.modalidadData.modalidad === CustomerModalidad.CLOUD
            ? customer.modalidadData.cloudCategory.price
            : 0,
      }));
    }
  }, [customer]);

  if (errorCustomers) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  const showForm =
    (!isLoadingCustomers && !isLoadingSelectedCustomer) || customer;

  return (
    <CuotaFormLayout onSubmit={handleNewCuota}>
      <FormControl sx={{ gridColumn: "1 / span 2" }}>
        <Autocomplete
          onChange={(event, customer) => {
            setCuota((prev) => ({ ...prev, customer }));
            searchParams.delete("customerId");
          }}
          disableClearable
          value={
            cuota.customer ||
            customer ||
            ({
              firstName: "",
              lastName: "",
            } as Customer)
          }
          getOptionLabel={(option: Customer) =>
            formatFullName(option.firstName, option.lastName)
          }
          disabled={isLoadingCustomers}
          options={customers ?? []}
          renderInput={(params) => (
            <TextField {...params} label="Selecciona el Cliente" />
          )}
        />
      </FormControl>

      {showForm && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Monto"
            type="number"
            disabled
            value={
              cuota.customer?.modalidadData.modalidad ===
              CustomerModalidad.CLOUD
                ? cuota.customer?.modalidadData.cloudCategory.price
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
                  status: e.target.value as CuotaStatus,
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

      {showForm && <CuotaPreview cuota={cuota} />}
      {showForm && (
        <Button type="submit" variant="contained" color="success">
          Confirmar
        </Button>
      )}
    </CuotaFormLayout>
  );
}
