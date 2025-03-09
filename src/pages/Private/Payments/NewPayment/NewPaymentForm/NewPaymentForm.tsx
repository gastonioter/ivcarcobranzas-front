import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, CustomerModalidad } from "@/models";
import { CuotaStatus } from "@/models/Cuota";
import CuotaPreview from "@/pages/Private/Cuotas/NewCuota/CuotaPreview/CuotaPreview";
import { useUpdateCuotasMutation } from "@/services/cuotasApi";
import {
  useGetCustomerQuery,
  useGetCustomersQuery,
} from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { FormEvent, useState } from "react";

export default function NewPaymentForm() {
  const [update] = useUpdateCuotasMutation();
  const snackbar = useSnackbar();
  const { data, isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const [selectedCuotas, setSelectedCuotas] = useState<string[]>([]);

  const cloudCustomers =
    data?.filter(
      (c) => c.modalidadData.modalidad === CustomerModalidad.CLOUD
    ) || [];

  const { data: customerData, isLoading: isLoadingCustomer } =
    useGetCustomerQuery(selectedCustomer?.uuid || "", {
      skip: !selectedCustomer?.uuid,
    });

  const toggleSelection = (uuid: string) => {
    if (selectedCuotas.includes(uuid)) {
      setSelectedCuotas(selectedCuotas.filter((cuota) => cuota !== uuid));
    } else {
      setSelectedCuotas([...selectedCuotas, uuid]);
    }
  };

  const handleNewPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await update({
        cuotasId: selectedCuotas,
        customerId: selectedCustomer?.uuid as string,
        status: CuotaStatus.PAID,
      }).unwrap();

      console.log(result);
      snackbar.openSnackbar("Pago creado con exito!");
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(e.data.error, "error");
    }
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleNewPayment}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Autocomplete
        disabled={isLoadingCustomers}
        value={selectedCustomer}
        onChange={(_, newValue) => {
          setSelectedCustomer(newValue);
          setSelectedCuotas([]);
        }}
        getOptionLabel={(option: Customer) =>
          formatFullName(option.firstName, option.lastName)
        }
        renderInput={(params) => (
          <TextField {...params} label="Selecciona el Cliente" />
        )}
        options={cloudCustomers}
      ></Autocomplete>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {!isLoadingCustomer &&
          selectedCustomer &&
          customerData?.modalidadData.modalidad === CustomerModalidad.CLOUD &&
          customerData.modalidadData.cuotas
            .filter(
              (cuota) =>
                cuota.status == CuotaStatus.PENDING ||
                cuota.status == CuotaStatus.LATE
            )
            .map((cuota) => (
              <Box
                onClick={() => toggleSelection(cuota.uuid)}
                sx={{
                  border: "3px solid",
                  borderColor: selectedCuotas.includes(cuota.uuid)
                    ? "primary.main"
                    : "transparent",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              >
                <CuotaPreview
                  key={cuota.uuid}
                  isPreview={false}
                  cuota={{
                    amonut: cuota.amount,
                    month: cuota.month,
                    year: cuota.year,
                    status: cuota.status,
                    customer: selectedCustomer,
                  }}
                />
              </Box>
            ))}
      </Box>

      {selectedCuotas.length > 0 && (
        <Button type="submit" variant="contained" color="success">
          Confirmar
        </Button>
      )}
    </Box>
  );
}
