import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { CustomerModalidad, PrivateRoutes } from "@/models";
import {
  useGetCustomerQuery,
  useGetCustomersQuery,
} from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import { Autocomplete, TextField } from "@mui/material";
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
      <SectionHeader showButton={false}>
        <SectionTitle>Recibos de Pago</SectionTitle>
      </SectionHeader>

      <Autocomplete
        sx={{ mt: 3 }}
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
    </>
  );
}
