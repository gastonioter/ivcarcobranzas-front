import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";
import {
  CreateCuotasPayload,
  CreateCuotasSchema,
  cuotaMonthOpts,
  CuotaStatus,
  InitalCuotaStatus,
} from "@/models/Cuota";
import { useCreateCuotasMutation } from "@/services/cuotasApi";
import { useGetCustomersQuery } from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { CuotaFormLayout } from "./styled-components/layout.styled.component";

const yearsOpts = [
  { value: new Date().getFullYear() - 1, label: new Date().getFullYear() - 1 },
  { value: new Date().getFullYear(), label: new Date().getFullYear() },
  { value: new Date().getFullYear() + 1, label: new Date().getFullYear() + 1 },
];

export type CuotaForm = Omit<CreateCuotasPayload, "customerId"> & {
  customer: Customer | undefined;
};

const initialCuota: CuotaForm = {
  year: new Date().getFullYear(),
  months: [cuotaMonthOpts[new Date().getMonth()]],
  amount: 20_000,
  status: CuotaStatus.PENDING,
  customer: undefined,
};

export default function CuotaForm() {
  const [body, setBody] = useState<CuotaForm>(initialCuota);
  const [searchParams] = useSearchParams();

  const snackbar = useSnackbar();
  const {
    data,
    isLoading: isLoadingCustomers,
    error: errorCustomers,
  } = useGetCustomersQuery();

  const [create] = useCreateCuotasMutation();

  const navigate = useNavigate();

  const customerId = searchParams.get("customerId");

  const customers = useMemo(
    () => data?.filter((c) => c.type === CustomerModalidad.CLOUD) as Customer[],
    [data],
  );

  const preselectedCustomer = useMemo(
    () => (customerId ? customers?.find((c) => c.uuid === customerId) : undefined),
    [customerId, customers],
  );

  const handleNewCuota = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ...body,
      customerId: body.customer?.uuid ?? "",
    };

    const result = CreateCuotasSchema.safeParse(data);
    if (result.success) {
      try {
        const createdCuotas = await create(data).unwrap();
        if (createdCuotas.length === 0) {
          snackbar.openSnackbar(
            "La cuotas seleccionadas ya fueron creadas",
            "warning",
          );
          return;
        }

        if (createdCuotas.length < body.months.length) {
          snackbar.openSnackbar(
            `Se crearon ${createdCuotas.length} de ${body.months.length} cuotas seleccionadas, algunas ya existían`,
            "success",
          );
        }

        navigate(
          `/private/${PrivateRoutes.CUOTAS}?customerId=${body.customer?.uuid}`,
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

  useEffect(() => {
    if (preselectedCustomer && !body.customer) {
      setBody((prev) => ({ ...prev, customer: preselectedCustomer }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedCustomer]);

  if (errorCustomers) {
    return (
      <Alert severity="error">Ocurrió un error al cargar los clientes</Alert>
    );
  }

  const showForm = !isLoadingCustomers || body.customer;

  return (
    <CuotaFormLayout onSubmit={handleNewCuota}>
      <FormControl sx={{ gridColumn: "1 / span 2" }}>
        <Autocomplete
          onChange={(_event, customer) => {
            setBody((prev) => ({ ...prev, customer }));
          }}
          disableClearable
          value={
            body.customer ||
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
            onChange={(e) =>
              setBody((prev) => ({
                ...prev,
                amount: parseFloat(e.target.value),
              }))
            }
            // defaultValue={
            // body.customer?.modalidadData.modalidad === CustomerModalidad.CLOUD
            // ? body.customer?.modalidadData.cloudCategory.price
            // : 0
            // }
            value={body.amount}
          ></TextField>
          <FormControl>
            <InputLabel>Para el mes o meses</InputLabel>
            <Select
              label="Para el mes o meses"
              multiple
              value={body.months}
              onChange={(e) => {
                setBody((prev) => ({
                  ...prev,
                  months: e.target.value as string[],
                }));
              }}
              renderValue={(selected) => selected.join(", ")}
            >
              {cuotaMonthOpts.map((month) => (
                <MenuItem key={month} value={month}>
                  <Checkbox checked={body.months.indexOf(month) > -1} />
                  <ListItemText primary={month} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Año</InputLabel>
            <Select
              label="Año"
              value={body.year}
              onChange={(e) => {
                setBody((prev) => ({
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
              value={body.status}
              onChange={(e) => {
                setBody((prev) => ({
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

          <Divider />
        </Box>
      )}
      {showForm && (
        <Button
          sx={{ gridColumn: 1 }}
          type="submit"
          size="large"
          variant="contained"
          color="success"
        >
          Crear Cuotas
        </Button>
      )}
    </CuotaFormLayout>
  );
}
