import { Circle } from "@mui/icons-material";
import { Card, CardContent, Divider, Tooltip, Typography } from "@mui/material";

export default function SalePaymentSummary({
  debe,
  haber,
}: {
  debe: number;
  haber: number;
}) {
  const saldo = debe - haber;
  const isPaid = saldo <= 0;

  return (
    <Card
      sx={{
        boxShadow: 3,
        flex: 0.4,
        flexBasis: 200,
        maxWidth: "100%",
        position: "relative",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h6" gutterBottom>
            Resumen de Venta
          </Typography>
          <Typography variant="body1">Debe: ${debe.toFixed(2)}</Typography>
          <Typography variant="body1">Haber: ${haber.toFixed(2)}</Typography>
          <Divider sx={{ mt: 4 }} />
          <Typography
            variant="h5"
            color={`${isPaid ? "success" : "warning"}`}
            sx={{ position: "absolute", bottom: 0, p: 8 }}
          >
            Saldo: ${saldo.toFixed(2)}
          </Typography>
          <Typography
            variant="h3"
            color="primary"
            sx={{ mt: 20, textAlign: "center" }}
          ></Typography>
        </div>
        <Tooltip title={isPaid ? "Pagado" : "Pendiente de Pagar"}>
          <Circle color={`${isPaid ? "success" : "warning"}`} />
        </Tooltip>
      </CardContent>
    </Card>
  );
}
