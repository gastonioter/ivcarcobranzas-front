import { Card, CardContent, Typography } from "@mui/material";

interface SaleSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

export default function SaleSummary({
  subtotal,
  tax,
  total,
}: SaleSummaryProps) {
  const getTaxAmount = (subtotal: number, tax: number) => {
    return (subtotal * tax) / 100;
  };
  return (
    <Card sx={{ maxWidth: 400, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumen de Venta
        </Typography>
        <Typography variant="body1">
          Subtotal: ${subtotal.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          IVA ({`${tax}%`}): ${getTaxAmount(subtotal, tax).toFixed(2)}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          Total: ${total.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}
