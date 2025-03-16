import { dialogCloseSubject$ } from "@/components";
import { Payment } from "@/models/Payment";
import { Box, Button, Typography } from "@mui/material";
export interface IPaymentDetailsProps {
  payment: Payment | null;
}

export default function PaymentDetails({ payment }: IPaymentDetailsProps) {
  if (!payment) {
    return null;
  }
  return (
    <>
      <Typography variant="h6">Cuotas Pagadas:</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
        }}
      >
        {payment.cuotas.map((cuota) => (
          <Box key={cuota.uuid} sx={{ border: "1px solid black", padding: 2 }}>
            {`Cuota ${cuota.month}/${cuota.year}`}
          </Box>
        ))}
      </Box>

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
    </>
  );
}
