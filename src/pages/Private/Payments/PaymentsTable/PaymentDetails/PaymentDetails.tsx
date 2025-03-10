import { dialogCloseSubject$ } from "@/components";
import { Payment } from "@/models/Payment";
import { formattedDate } from "@/utilities";
import { Box, Button, Typography } from "@mui/material";
export interface IPaymentDetailsProps {
  payment: Payment | null;
}

export default function PaymentDetails({ payment }: IPaymentDetailsProps) {
  if (!payment) {
    return null;
  }
  return (
    <Box sx={{ p: 5, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Detalle del Pago
      </Typography>

      <Typography variant="body1">{`Monto: ${payment.total}`}</Typography>

      <Typography variant="body1">{`Fecha: ${formattedDate(
        payment.createdAt as unknown as string
      )}`}</Typography>

      <Typography variant="body1">
        Cuotas Pagadas:
        {payment.cuotas.map((cuota) => (
          <Box key={cuota.uuid} sx={{ border: "1px solid black", padding: 1 }}>
            {`Cuota ${cuota.month}/${cuota.year}`}
          </Box>
        ))}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ width: "fit-content", mt: 3 }}
        onClick={() => {
          dialogCloseSubject$.setSubject = true;
        }}
      >
        Cerrar
      </Button>
    </Box>
  );
}
