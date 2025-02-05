import { formattedCurrency } from "@/utilities/formatPrice";
import { Card, CardContent, Typography } from "@mui/material";

interface SaleSummaryProps {
  subtotal: number;
  tax: number;
  sx: object;
}

export default function SaleSummary({ subtotal, tax, sx }: SaleSummaryProps) {
  const total = subtotal + (subtotal * tax) / 100;

  const getTaxAmount = (subtotal: number, tax: number) => {
    return (subtotal * tax) / 100;
  };
  return (
    <Card sx={{ p: 0, boxShadow: 3, ...sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumen de Venta
        </Typography>
        <Typography variant="body1">
          Subtotal: {formattedCurrency(subtotal)}
        </Typography>
        <Typography variant="body1">
          IVA ({`${tax}%`}): {formattedCurrency(getTaxAmount(subtotal, tax))}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          Total: {formattedCurrency(total)}
        </Typography>
      </CardContent>
    </Card>
  );
}
