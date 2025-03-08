import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

import { useGetCustomersQuery } from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import { Autocomplete, FormControl, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import CuotasTable from "./CuotasTable/CuotasTable";

export default function Cuotas() {
  const navigate = useNavigate();
  const { customerId } = useParams();

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
            navigate(-1);
          } else {
            navigate(PrivateRoutes.NEW_CUOTA);
          }
        }}
        buttonProps={{
          icon: customerId ? <ArrowBackIcon /> : <AddIcon />,
          text: customerId ? "Atras" : "Nuevo",
          variant: customerId ? "outlined" : "contained",
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
            disabled={isLoadingCostumers || !!customerId}
            options={customers ?? []}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
        </FormControl>

        {customer && <CuotasTable customerId={customer.uuid} />}
      </Paper>
    </>
  );
}
