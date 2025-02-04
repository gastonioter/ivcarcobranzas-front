import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateCustomerFormData,
  CreateCustomerSchema,
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
import { useState } from "react";
import { useForm } from "react-hook-form";

function CustomerForm() {
  const [create, { isLoading }] = useCreateCustomerMutation();
  const [typeSelected, setTypeSelected] = useState<string>("");
  const snackbar = useSnackbar();
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
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          ></TextField>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="type">Tipo de Cliente</InputLabel>
          <Select
            value={typeSelected}
            labelId="type"
            label="Tipo de Cliente"
            {...register("type", {
              onChange: (e) => setTypeSelected(e.target.value as string),
            })}
          >
            {Object.values(CustomerType).map((type) => (
              <MenuItem value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {typeSelected === CustomerType.CLOUD && (
        <FormControl>
          <TextField
            id="montoMes"
            label="Monto mensual"
            {...register("montoMes")}
            type="number"
            error={!!errors.montoMes}
            helperText={errors.montoMes?.message}
            required
          ></TextField>
        </FormControl>
      )}
      <Button
        sx={{ mt: 2, width: "fit-content", alignSelf: "flex-end" }}
        type="submit"
        variant="contained"
        color="primary"
        loading={isLoading}
        loadingPosition="end"
      >
        Agregar
      </Button>
    </Box>
  );
}

export default CustomerForm;
