import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Customer } from "@/models";
import { useGetCustomersQuery } from "@/services/customerApi";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import CuotasTable from "./CuotasTable/CuotasTable";

export interface ICuotasProps {
  customerId?: string;
}

export default function Cuotas({ customerId }: ICuotasProps) {
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const { data: customers, isLoading: isLoadingCostumers } =
    useGetCustomersQuery();

  return (
    <>
      <SectionHeader>
        <SectionTitle>Cuotas Menuales</SectionTitle>
      </SectionHeader>

      <FormControl>
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
    </>
  );
}
