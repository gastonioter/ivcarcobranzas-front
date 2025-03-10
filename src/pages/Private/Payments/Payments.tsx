import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { CustomerModalidad, PrivateRoutes } from "@/models";
import {
  useGetCustomerQuery,
  useGetCustomersQuery,
} from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import PaymentsTable from "./PaymentsTable/PaymentsTable";

export default function Payments() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useGetCustomersQuery();

  const updateSearchParams = (key: string, value: string) => {
    const nuevosParams = new URLSearchParams(searchParams);
    if (value) {
      nuevosParams.set(key, value);
    } else {
      nuevosParams.delete(key);
    }
    setSearchParams(nuevosParams);
  };

  const customers =
    data?.filter((c) => c.modalidadData.modalidad == CustomerModalidad.CLOUD) ||
    [];

  const customerId = searchParams.get("customerId");

  const selected = customers.find((c) => c.uuid === customerId) || {
    firstName: "",
    lastName: "",
    uuid: "",
  };

  const { data: customerData } = useGetCustomerQuery(customerId || "", {
    skip: !customerId,
  });

  return (
    <>
      <SectionHeader
        customClickHandler={() => {
          navigate(
            `${PrivateRoutes.NEW_PAYMENT}${
              customerId ? `?customerId=${customerId}` : ""
            } `
          );
        }}
      >
        <SectionTitle>Pago de Cuotas</SectionTitle>
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
        <Autocomplete
          options={customers}
          value={selected}
          onChange={(e, value) => {
            updateSearchParams("customerId", value?.uuid ?? "");
          }}
          getOptionLabel={(option) =>
            formatFullName(option.firstName, option.lastName)
          }
          renderInput={(params) => (
            <TextField {...params} label="Selecciona el Cliente" />
          )}
        />

        {customerData && <PaymentsTable customer={customerData} />}
      </Paper>
    </>
  );
}
