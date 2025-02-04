import { dialogCloseSubject$ } from "@/components/CustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateCustomerFormData,
  CreateCustomerSchema,
  Customer,
  CustomerType,
} from "@/models/customer";
import { useCreateCustomerMutation } from "@/services/customerApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function CustomerForm({
  customer,
  setCostumer,
}: {
  customer: Customer | null;
  setCostumer: React.Dispatch<React.SetStateAction<Customer | null>>;
}) {
  const [create, { isLoading }] = useCreateCustomerMutation();
  const [typeSelected, setTypeSelected] = useState<string>("");
  const snackbar = useSnackbar();

  useEffect(() => {
    if (customer) {
      setTypeSelected(customer.type);
    }
  }, [customer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(CreateCustomerSchema),
  });

  const onSubmit = async (data: CreateCustomerFormData) => {
    try {
      await create(data).unwrap();
      snackbar.openSnackbar(`Cliente ${data.firstName} creado con éxito`);
    } catch (error) {
      snackbar.openSnackbar(`${error.data.error}`, "error");
      console.error(error);
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl fullWidth>
          <TextField
            defaultValue={customer?.firstName}
            id="firstName"
            label="Nombre"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="lastName"
            defaultValue={customer?.lastName}
            label="Apellido"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          ></TextField>
        </FormControl>
      </Stack>

      <FormControl>
        <TextField
          id="email"
          label="Correo electrónico"
          {...register("email")}
          defaultValue={customer?.email}
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        ></TextField>
      </FormControl>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl fullWidth>
          <TextField
            id="phone"
            label="Teléfono"
            defaultValue={customer?.phone}
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          ></TextField>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tipo de Cliente</InputLabel>
          <Select
            value={typeSelected}
            label="Tipo de Cliente"
            {...register("type", {
              onChange: (e) => setTypeSelected(e.target.value as string),
            })}
          >
            {Object.values(CustomerType).map((type) => {
              return (
                <MenuItem key={type} value={type}>
                  {type.toUpperCase()}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {typeSelected === CustomerType.CLOUD && (
        <FormControl>
          <TextField
            id="montoMes"
            defaultValue={customer?.montoMes}
            label="Monto mensual"
            {...register("montoMes")}
            type="number"
            error={!!errors.montoMes}
            helperText={errors.montoMes?.message}
            required
          ></TextField>
        </FormControl>
      )}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setCostumer(null);
            dialogCloseSubject$.setSubject = true;
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={isLoading}
          loadingPosition="end"
        >
          {customer ? "Editar" : "Agregar"}
        </Button>
      </Stack>
    </Box>
  );
}

export default CustomerForm;
