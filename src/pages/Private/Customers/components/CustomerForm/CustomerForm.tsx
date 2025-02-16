import { dialogCloseSubject$ } from "@/components/CustomDialog";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  CloudCustomerType,
  CreateCustomerFormData,
  createCustomerSchema,
  Customer,
  CustomerModalidad,
  ModalidadData,
} from "@/models/customer";
import { useGetCloudCategoriesQuery } from "@/services/cloudCategoriesApi";
import {
  useCreateCustomerMutation,
  useEditCustomerMutation,
} from "@/services/customerApi";
import { formattedCurrency } from "@/utilities/formatPrice";
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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { set } from "zod";

interface BaseCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
function CustomerForm({
  customer,
  setCostumer,
}: {
  customer: Customer | null;
  setCostumer: React.Dispatch<React.SetStateAction<Customer | null>>;
}) {
  const { data: cloudCategories, isLoading: loadingCloudCategories } =
    useGetCloudCategoriesQuery();

  const [create, { isLoading }] = useCreateCustomerMutation();
  const [edit, { isLoading: isEditing }] = useEditCustomerMutation();
  const [baseCustomer, setBaseCustomer] = useState<BaseCustomer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [cloudModalidadData, setCloudModalidadData] = useState({
    cloudCategoryId: "",
  });

  const [modalidad, setModalidad] = useState<CustomerModalidad>(
    CustomerModalidad.REGULAR
  );

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => {
    const { name, value } = e.target;
    setBaseCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCloudDataChange = (e: any) => {
    const { name, value } = e.target;
    setCloudModalidadData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const snackbar = useSnackbar();

  useEffect(() => {
    /* Update form inputs based on the modalidad customer  */
    if (customer) {
      setBaseCustomer({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      });

      setModalidad(customer.modalidadData.modalidad);

      if (customer.modalidadData.modalidad == CustomerModalidad.CLOUD) {
        setCloudModalidadData({
          cloudCategoryId: customer.modalidadData.cloudCategory.uuid,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const editMode = !!customer;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = createCustomerSchema.safeParse({
      ...baseCustomer,
      modalidadData: {
        modalidad,
        ...cloudModalidadData,
        //...regularModalidadData,
      },
    });
    if (result.success) {
      const { data } = result;
      try {
        if (!editMode) {
          await create(data).unwrap();
        } else {
          await edit({ uuid: customer.uuid, ...data }).unwrap();
        }

        dialogCloseSubject$.setSubject = false;
        snackbar.openSnackbar(
          `Cliente ${editMode ? "editado" : "creado"} con éxito`
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
            value={modalidad}
            onChange={(e) => {
              setModalidad(e.target.value as CustomerModalidad);
            }}
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
      {/* CONDITIONAL FORM BASED ON CUSTOMER MODALIAD */}
      {modalidad === CustomerModalidad.CLOUD && (
        <FormControl fullWidth>
          <InputLabel>Categoria de Pago</InputLabel>
          <Select
            disabled={loadingCloudCategories}
            value={cloudModalidadData.cloudCategoryId}
            label="Categoria de Pago"
            onChange={handleCloudDataChange}
            name="cloudCategoryId"
          >
            {cloudCategories?.map((category) => {
              return (
                <MenuItem key={category.uuid} value={category.uuid}>
                  {`${category.name.toUpperCase()} - ${formattedCurrency(
                    category.price
                  )}`}
                </MenuItem>
              );
            })}
          </Select>
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
