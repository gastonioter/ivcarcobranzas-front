import { dialogCloseSubject$ } from "@/components/CustomDialog";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateCustomerFormData,
  CreateCustomerSchema,
  Customer,
  CustomerType,
} from "@/models/customer";
import {
  useCreateCustomerMutation,
  useEditCustomerMutation,
} from "@/services/customerApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
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
  const [edit, { isLoading: isEditing }] = useEditCustomerMutation();

  const [typeSelected, setTypeSelected] = useState<string>("");
  const snackbar = useSnackbar();

  const editMode = !!customer;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(CreateCustomerSchema),
  });

  useEffect(() => {
    if (customer) {
      setValue("firstName", customer.firstName);
      setValue("lastName", customer.lastName);
      setValue("email", customer.email);
      setValue("phone", customer.phone);
      setValue("type", customer.type);
      setTypeSelected(customer.type);
      if (customer.montoMes) setValue("montoMes", customer.montoMes);
    }
  }, [customer, setValue]);

  const onSubmit = async (data: CreateCustomerFormData) => {
    console.log("submit");
    try {
      if (!editMode) {
        await create(data).unwrap();
      } else {
        await edit({ uuid: customer?.uuid, ...data }).unwrap();
      }

      dialogCloseSubject$.setSubject = false;
      snackbar.openSnackbar(
        `Cliente ${editMode ? "editado" : "creado"} con éxito`
      );
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(`${e.data.error}`, "error");
    } finally {
      console.log("finally");
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
            {...register("type")}
            onChange={(e) => {
              const value = e.target.value as CustomerType;
              setTypeSelected(value);
              setValue("type", value);
            }}
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
      <FooterCustomDialog
        isLoading={isLoading || isEditing}
        onClose={() => {
          setCostumer(null);
        }}
        editMode={editMode}
      />
    </Box>
  );
}

export default CustomerForm;
