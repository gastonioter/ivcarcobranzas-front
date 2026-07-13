import { dialogCloseSubject$ } from "@/components/CustomDialog";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  createCustomerSchema,
  Customer,
  CustomerModalidad,
} from "@/models/customer";
import {
  useCreateCustomerMutation,
  useEditCustomerMutation,
} from "@/services/customerApi";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";

function CustomerForm({
  customer,
  setCostumer,
}: {
  customer: Customer | null;
  setCostumer: React.Dispatch<React.SetStateAction<Customer | null>>;
}) {
  console.log("customer", customer);
  const [create, { isLoading }] = useCreateCustomerMutation();
  const [edit, { isLoading: isEditing }] = useEditCustomerMutation();
  const [baseCustomer, setBaseCustomer] = useState<
    Omit<
      Customer,
      "modalidadData" | "createdAt" | "updatedAt" | "uuid" | "status"
    >
  >({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    cuit: customer?.cuit || "",
    type: customer?.type || CustomerModalidad.REGULAR,
  });

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | SelectChangeEvent<any>,
  ) => {
    const { name, value } = e.target;
    setBaseCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const snackbar = useSnackbar();

  const editMode = !!customer;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = createCustomerSchema.safeParse({
      ...baseCustomer,
    });
    if (result.success) {
      const { data } = result;
      try {
        if (!editMode) {
          await create(data).unwrap();
        } else {
          await edit({
            uuid: customer?.uuid || "",
            ...data,
          }).unwrap();
        }

        dialogCloseSubject$.setSubject = false;
        snackbar.openSnackbar(
          `Cliente ${editMode ? "editado" : "creado"} con éxito`,
        );
        setCostumer(null);
      } catch (e) {
        console.log(e);
        snackbar.openSnackbar(`${e.data.error}`, "error");
      }
    } else {
      const errorMessage = result.error.errors[0].message;

      snackbar.openSnackbar(`${errorMessage}`, "error");
    }
  };
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl fullWidth>
          <TextField
            defaultValue={customer?.firstName}
            id="firstName"
            label="Nombre"
            name="firstName"
            value={baseCustomer?.firstName}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="lastName"
            defaultValue={customer?.lastName}
            onChange={handleInputChange}
            label="Apellido"
            name="lastName"
            value={baseCustomer?.lastName}
          ></TextField>
        </FormControl>
      </Stack>
      <FormControl>
        <TextField
          id="email"
          label="Correo electrónico"
          type="email"
          name="email"
          value={baseCustomer?.email}
          onChange={handleInputChange}
        ></TextField>
      </FormControl>
      <FormControl>
        <TextField
          id="cuit"
          label="CUIT"
          type="text"
          name="cuit"
          value={baseCustomer?.cuit}
          onChange={handleInputChange}
        ></TextField>
      </FormControl>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl fullWidth>
          <TextField
            id="phone"
            name="phone"
            placeholder="Caracteristica + Número"
            label="Celular"
            value={baseCustomer?.phone}
            onChange={handleInputChange}
          ></TextField>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tipo de Cliente</InputLabel>
          <Select
            label="Tipo de Cliente"
            value={baseCustomer?.type}
            name="type"
            onChange={handleInputChange}
          >
            {Object.values(CustomerModalidad).map((type) => {
              return (
                <MenuItem key={type} value={type}>
                  {type.toUpperCase()}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
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
