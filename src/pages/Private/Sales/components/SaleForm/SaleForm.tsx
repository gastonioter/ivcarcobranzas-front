import { Customer } from "@/models/customer";
import { useGetCustomersQuery } from "@/services/customerApi";
import {
  Autocomplete,
  Box,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";
import SaleSummary from "./components/SaleSummary/SaleSummary";

export default function SaleForm() {
  const { data: customers, isLoading } = useGetCustomersQuery();

  const customersOptions = customers?.map(
    (customer: Customer) => `${customer.firstName} ${customer.lastName}`
  );
  return (
    <Box component={"form"}>
      <Stack spacing={2} direction={"row"}>
        <FormControl sx={{ flex: 1 }}>
          <Autocomplete
            sx={{ width: "100%" }}
            disablePortal
            disabled={isLoading}
            options={customersOptions ?? []}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
        </FormControl>

        <TextField label={"IVA"} type="number"></TextField>
      </Stack>

      <SaleSummary subtotal={4023} tax={16} total={116} />
    </Box>
  );
}
