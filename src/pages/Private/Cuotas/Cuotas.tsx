import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";
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
  );

  useEffect(() => {
    if (customerId) {
      const customer = customers?.find((c) => c.uuid === customerId);
      setCustomer(customer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, setCustomer]);

  return (
    <>
      <SectionHeader
        customClickHandler={() => {
          navigate(`${PrivateRoutes.NEW_CUOTA}`);
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
            value={customer}
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
