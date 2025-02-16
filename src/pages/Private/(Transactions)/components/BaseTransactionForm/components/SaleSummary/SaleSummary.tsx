import { useSummary } from "@/pages/Private/(Transactions)/hooks/summary";
import { useTransaction } from "@/pages/Private/(Transactions)/hooks/transaction";
import { getSubtotalAmount } from "@/pages/Private/(Transactions)/utils";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Card, CardContent, Stack, Typography } from "@mui/material";

interface SaleSummaryProps {
  sx: object;

  forBudget: boolean;
}

export default function SaleSummary({
  sx,
  forBudget = false,
}: SaleSummaryProps) {
  const entity = forBudget ? "Presupuesto" : "Venta";

  const { iva } = useSummary();
  const { details } = useTransaction();

  const subtotal = getSubtotalAmount(details);

  const taxAmount = (subtotal * iva) / 100;

  const total = subtotal + taxAmount;

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
              IVA ({`${iva}%`}): {formattedCurrency(taxAmount)}
            </Typography>
            {/* <Typography variant="body1">
              Descuento ({`${discount}%`}): {formattedCurrency(discountAmount)}
            </Typography> */}
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Total: {formattedCurrency(total)}
            </Typography>
          </div>
        </CardContent>
      </Stack>
    </Card>
  );
}
