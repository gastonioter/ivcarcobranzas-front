import { formattedCurrency } from "@/utilities/formatPrice";
import { Circle } from "@mui/icons-material";
import { Card, CardContent, Stack, Tooltip, Typography } from "@mui/material";

interface SaleSummaryProps {
  subtotal: number;
  tax: number;
  sx: object;
  isCancelled: boolean;
  forBudget: boolean;
}

export default function SaleSummary({
  subtotal,
  tax,
  sx,
  isCancelled,
  forBudget = false,
}: SaleSummaryProps) {
  const entity = forBudget ? "Presupuesto" : "Venta";
  const total = subtotal + (subtotal * tax) / 100;

  const getTaxAmount = (subtotal: number, tax: number) => {
    return (subtotal * tax) / 100;
  };
  return (
    <Card
      sx={{
        p: 0,
        boxShadow: 3,
        ...sx,
      }}
    >
      <Stack>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h6" gutterBottom>
              Resumen de {entity}
            </Typography>
            <Typography variant="body1">
              Subtotal: {formattedCurrency(subtotal)}
            </Typography>
            <Typography variant="body1">
              IVA ({`${tax}%`}):{" "}
              {formattedCurrency(getTaxAmount(subtotal, tax))}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Total: {formattedCurrency(total)}
            </Typography>
          </div>

          {isCancelled && !forBudget && (
            <Tooltip title="Venta Cancelada" arrow>
              <Circle color="error" />
            </Tooltip>
          )}
        </CardContent>
      </Stack>
    </Card>
  );
}
