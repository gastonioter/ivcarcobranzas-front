import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";

import { useGetCustomersQuery } from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import { Autocomplete, FormControl, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import CuotasTable from "./CuotasTable/CuotasTable";

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

      <Paper
        sx={{
          p: 2,
          height: {
            xs: "auto",
            md: "100%",
          },
        }}
      >
        <FormControl fullWidth>
          <Autocomplete
            onChange={(event, customer) => {
              setCustomer(customer);
              updateSearchParams("customerId", customer?.uuid || "");
            }}
            disableClearable
            value={
              customer ||
              ({
                firstName: "",
                lastName: "",
              } as Customer)
            }
            getOptionLabel={(option: Customer) =>
              `${option.firstName} ${option.lastName}`
            }
            disabled={isLoadingCostumers}
            options={customers ?? []}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
        </FormControl>

        {customer && <CuotasTable customerId={customer.uuid} />}
      </Paper>
    </>
  );
}
