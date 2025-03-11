import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";

import { useGetCustomersQuery } from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import CuotasTable from "./CuotasTable/CuotasTable";
import { useGenerateAllCuotasMutation } from "@/services/cuotasApi";
import { useSnackbar } from "@/context/SnackbarContext";

export default function Cuotas() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (key: string, value: string) => {
    const nuevosParams = new URLSearchParams(searchParams);
    if (value) {
      nuevosParams.set(key, value); // Agregar o actualizar parámetro
    } else {
      nuevosParams.delete(key); // Eliminar si está vacío
    }
    setSearchParams(nuevosParams);
  };

  const snackbar = useSnackbar();

  const [generate, result] = useGenerateAllCuotasMutation();
  const generateAllCuotas = async () => {
    try {
      await generate({}).unwrap();
      snackbar.openSnackbar(
        "Se ha generado para cada cliente la cuota para el mes corriente",
        "success"
      );
    } catch (e) {
      snackbar.openSnackbar(
        "Ha ocurrido un error al intentar generar las cuotas",
        "error"
      );
      console.error(e);
    }
  };
  const customerId = searchParams.get("customerId");

  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const { data, isLoading: isLoadingCostumers } = useGetCustomersQuery();

  const customers = data?.filter(
    (customer) => customer.modalidadData.modalidad === CustomerModalidad.CLOUD
  ) as Customer[];

  useEffect(() => {
    if (customerId && customers) {
      const customer = customers.find((c) => c.uuid === customerId);
      setCustomer(customer);
    }
  }, [customerId, customers]);

  return (
    <>
      <SectionHeader
        customClickHandler={() => {
          if (customerId) {
            navigate(
              `/private/cuotas/${PrivateRoutes.NEW_CUOTA}?customerId=${customerId}`
            );
          } else {
            navigate(PrivateRoutes.NEW_CUOTA);
          }
        }}
      >
        <SectionTitle>
          Cuotas Menuales:{" "}
          {customer &&
            `${formatFullName(customer?.firstName, customer?.lastName)}`}
        </SectionTitle>
      </SectionHeader>

      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <Autocomplete
            onChange={(event, customer) => {
              if (!customer) return;
              setCustomer(customer);
              updateSearchParams("customerId", customer?.uuid || "");
            }}
            value={
              customer ||
              ({
                firstName: "",
                lastName: "",
              } as Customer)
            }
            getOptionLabel={(option: Customer) =>
              formatFullName(option.firstName, option.lastName)
            }
            disabled={isLoadingCostumers}
            options={customers ?? []}
            renderInput={(params) => (
              <TextField {...params} label="Selecciona el Cliente" />
            )}
          />
        </FormControl>
        {customer && <CuotasTable customerId={customer.uuid} />}

        {!customer && (
          <Button
            color="warning"
            variant="contained"
            loading={result.isLoading}
            sx={{ mt: "auto" }}
            onClick={generateAllCuotas}
          >
            Crear cutoas para todos los clientes
          </Button>
        )}
      </Box>
    </>
  );
}
