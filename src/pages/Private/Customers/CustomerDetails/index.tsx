import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { CustomDialog, dialogOpenSubject$ } from "@/components/CustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { useSendRsmMontiWpp } from "@/hooks/useSendRsmMonitWpp";
import { PrivateRoutes } from "@/models";
import { Customer, CustomerStatus } from "@/models/customer";
import {
  useDeleteCustomerMutation,
  useEditCustomerMutation,
  useGetAccountSummaryQuery,
  useGetCustomerQuery,
} from "@/services/customerApi";
import { formattedDate } from "@/utilities";
import { formattedCurrency } from "@/utilities/formatPrice";
import { formatFullName } from "@/utilities/formatFullName";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PaymentIcon from "@mui/icons-material/Payment";
import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import CustomerForm from "../components/CustomerForm/CustomerForm";
import CustomerStatusIndicator from "../components/CustomerStatusIndicator/CustomerStatusIndicator";

export default function CustomerDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [dialogCustomer, setDialogCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [wppConfirmOpen, setWppConfirmOpen] = useState(false);

  const {
    data: customer,
    isLoading,
    error,
  } = useGetCustomerQuery(uuid as string);

  // const { data: accountSummary, isLoading: summaryLoading } =
  //   useGetAccountSummaryQuery(uuid!);

  const [editCustomerMutation] = useEditCustomerMutation();
  const [deleteFn] = useDeleteCustomerMutation();
  const { sendWpp, sending } = useSendRsmMontiWpp(uuid!);

  const toggleStatus = async () => {
    if (!customer) return;
    try {
      await editCustomerMutation({
        uuid: customer.uuid,
        status:
          customer.status === CustomerStatus.ACTIVE
            ? CustomerStatus.INACTIVE
            : CustomerStatus.ACTIVE,
      }).unwrap();
      snackbar.openSnackbar("Estado actualizado con éxito");
    } catch (e: any) {
      snackbar.openSnackbar(`${e?.data?.error || "Error"}`, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFn(uuid!).unwrap();
      snackbar.openSnackbar("Cliente eliminado!");
      navigate(`/private/${PrivateRoutes.CUSTOMERS}`);
    } catch (e: any) {
      snackbar.openSnackbar(`${e?.data?.error || "Error"}`, "error");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return <Alert severity="error">No se pudo cargar el cliente.</Alert>;
  }

  const fullName = formatFullName(customer.firstName, customer.lastName);

  return (
    <>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => navigate(`/private/${PrivateRoutes.CUSTOMERS}`)}
          >
            Volver
          </Button>

          <Stack direction="row" alignItems="center" spacing={1.5} flex={1}>
            <Typography variant="h5" fontWeight="bold">
              {fullName}
            </Typography>
            <CustomerStatusIndicator status={customer.status} />
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                setDialogCustomer(customer);
                dialogOpenSubject$.setSubject = true;
              }}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color={
                customer.status === CustomerStatus.ACTIVE
                  ? "warning"
                  : "success"
              }
              onClick={toggleStatus}
            >
              {customer.status === CustomerStatus.ACTIVE
                ? "Dar de baja"
                : "Dar de alta"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Info Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Información del Cliente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="Teléfono" value={customer.phone} />
              <InfoRow label="CUIT" value={customer.cuit || "—"} />
              <InfoRow label="Tipo" value={customer.type.toUpperCase()} />
              <InfoRow
                label="Registrado"
                value={formattedDate(customer.createdAt as unknown as string)}
              />
              <InfoRow
                label="Última actualización"
                value={formattedDate(customer.updatedAt as unknown as string)}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Account Summary */}
        {/* <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Resumen de Cuenta
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {summaryLoading ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress size={32} />
              </Box>
            ) : accountSummary ? (
              <Stack spacing={2}>
                <InfoRow
                  label="Debe"
                  value={formattedCurrency(accountSummary.debe)}
                />
                <InfoRow
                  label="Haber"
                  value={formattedCurrency(accountSummary.haber)}
                />
                <Divider />
                <InfoRow
                  label="Saldo"
                  value={formattedCurrency(accountSummary.saldo)}
                  highlight
                />
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Sin datos de cuenta.
              </Typography>
            )}
          </Paper>
        </Grid> */}

        {/* Navigation Cards */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardActionArea
              onClick={() =>
                navigate(`/private/${PrivateRoutes.CUOTAS}?customerId=${uuid}`)
              }
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormatListBulletedIcon fontSize="large" color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Cuotas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver todas las cuotas del cliente
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardActionArea
              onClick={() =>
                navigate(
                  `/private/${PrivateRoutes.PAYMENTS}?customerId=${uuid}`,
                )
              }
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PaymentIcon fontSize="large" color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Recibos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver todos los recibos del cliente
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Reports */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Reportes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() =>
                  window.open(
                    `${import.meta.env.VITE_BASE_API_URL}/prints/rsmmonit/${uuid}`,
                  )
                }
              >
                Rsm. Monit.
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() =>
                  window.open(
                    `${import.meta.env.VITE_BASE_API_URL}/prints/rsmcta/${uuid}`,
                  )
                }
              >
                Rsm. Cta.
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={() => setWppConfirmOpen(true)}
              >
                Enviar Rsm. por WhatsApp
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <CustomDialog title="Editar Cliente">
        <CustomerForm
          customer={dialogCustomer}
          setCostumer={setDialogCustomer}
        />
      </CustomDialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        close={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={false}
      >
        <>
          Estás a punto de <strong>eliminar</strong> al cliente{" "}
          <strong>{fullName}</strong>. Esta acción no se puede deshacer.
        </>
      </ConfirmationDialog>

      {/* WhatsApp Confirmation */}
      <ConfirmationDialog
        open={wppConfirmOpen}
        close={() => setWppConfirmOpen(false)}
        onConfirm={sendWpp}
        loading={sending}
      >
        <>
          Estás a punto de <strong>enviar el resumen de monitoreo</strong> al
          número de WhatsApp del cliente, ¿Estás seguro de continuar?
        </>
      </ConfirmationDialog>
    </>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={highlight ? "bold" : "normal"}
        color={highlight ? "primary.main" : "text.primary"}
      >
        {value}
      </Typography>
    </Stack>
  );
}
