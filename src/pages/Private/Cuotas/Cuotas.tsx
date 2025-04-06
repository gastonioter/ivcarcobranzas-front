import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import {
  Customer,
  CustomerModalidad,
  CustomerStatus,
  PrivateRoutes,
} from "@/models";

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
import { WhatsApp } from "@mui/icons-material";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { useSendRsmMontiWpp } from "@/hooks/useSendRsmMonitWpp";

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

  const [generate, { isLoading }] = useGenerateAllCuotasMutation();
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

  const [openDialog, setOpenDialog] = useState(false);

  const customerId = searchParams.get("customerId");

  const { sendWpp, sending } = useSendRsmMontiWpp(customerId || "");

  const [customer, setCustomer] = useState<Customer | undefined | null>(
    undefined
  );
  const { data, isLoading: isLoadingCostumers } = useGetCustomersQuery();

  const customers = data?.filter(
    (customer) =>
      customer.modalidadData.modalidad === CustomerModalidad.CLOUD &&
      customer.status === CustomerStatus.ACTIVE
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
          Cuotas Menuales:
          {customer &&
            ` ${formatFullName(customer?.firstName, customer?.lastName)}`}
        </SectionTitle>
      </SectionHeader>

      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <Autocomplete
            onChange={(event, customer) => {
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
        {customer && customerId && <CuotasTable customerId={customer.uuid} />}

        {!customer && !customerId ? (
          <Button
            color="warning"
            variant="contained"
            loading={isLoading}
            sx={{ mt: "auto", fontSize: "1rem" }}
            onClick={generateAllCuotas}
          >
            Crear cutoas para todos los clientes
          </Button>
        ) : (
          <Button
            endIcon={<WhatsApp />}
            variant="contained"
            color="warning"
            sx={{ fontSize: "1rem" }}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Enviar resumen
          </Button>
        )}
      </Box>

      <ConfirmationDialog
        loading={sending}
        onConfirm={sendWpp}
        open={openDialog}
        close={() => setOpenDialog(false)}
      >
        <>
          Estas a punto de <strong>enviar el resumen de monitoreo</strong> al
          WhatsApp del cliente con todas las cuotas pendientes de pago, ¿Estás
          seguro de continuar?
        </>
      </ConfirmationDialog>
    </>
  );
}
