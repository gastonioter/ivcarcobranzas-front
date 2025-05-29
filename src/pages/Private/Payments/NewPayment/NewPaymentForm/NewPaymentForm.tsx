import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, CustomerModalidad, PrivateRoutes } from "@/models";
import { CuotaStatus } from "@/models/Cuota";
import CuotaPreview from "@/pages/Private/Cuotas/NewCuota/components/CuotaPreview/CuotaPreview";

import { useUpdateCuotasMutation } from "@/services/cuotasApi";
import {
  useGetCustomerQuery,
  useGetCustomersQuery,
} from "@/services/customerApi";
import { formatFullName } from "@/utilities/formatFullName";
import { Alert, Autocomplete, Box, Button, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function NewPaymentForm({ customer }: { customer?: Customer }) {
  const [update] = useUpdateCuotasMutation();

  const navigate = useNavigate();
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
      skip: !selectedCustomer?.uuid || !!customer,
    });

  useEffect(() => {
    if (customer) {
      setSelectedCustomer(customer);
    }
  }, [customer]);

  useEffect(() => {
    if (customerData) {
      setSelectedCustomer(customerData);
    }
  }, [customerData]);

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
      await update({
        cuotasId: selectedCuotas,
        customerId: selectedCustomer?.uuid as string,
        status: CuotaStatus.PAID,
      }).unwrap();

      navigate(
        `/private/${PrivateRoutes.PAYMENTS}?customerId=${selectedCustomer?.uuid}`
      );
      snackbar.openSnackbar("Pago creado con exito!");
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(e.data.error, "error");
    }
  };

  if (isLoadingCustomer || isLoadingCustomers) {
    return <p>Loading</p>;
  }

  const cuotasToPay =
    selectedCustomer?.modalidadData.modalidad === CustomerModalidad.CLOUD
      ? selectedCustomer.modalidadData.cuotas.filter(
          (cuota) =>
            cuota.status == CuotaStatus.PENDING ||
            cuota.status == CuotaStatus.LATE
        )
      : [];

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
        {cuotasToPay.length > 0 &&
          cuotasToPay.map((cuota) => (
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
                  customer: customerData || customer,
                }}
              />
            </Box>
          ))}

        {selectedCustomer && cuotasToPay.length == 0 && (
          <Alert severity="success">
            El cliente no tiene cuotas pendientes de pago
          </Alert>
        )}
      </Box>

      {selectedCuotas.length > 0 && (
        <Button type="submit" variant="contained" color="success">
          Confirmar
        </Button>
      )}
    </Box>
  );
}
