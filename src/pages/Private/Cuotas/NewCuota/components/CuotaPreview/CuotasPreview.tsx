import { CuotaStatus } from "@/models/Cuota";
import { formatFullName } from "@/utilities/formatFullName";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Circle } from "@mui/icons-material";
import { Box, Paper, Tooltip, Typography } from "@mui/material";
import { cuotaForm } from "../CuotaForm/CuotaForm";

export interface ICuotaPreviewProps {
  cuotas: cuotaForm;
  isPreview?: boolean;
}

export default function CuotasPreview({
  cuotas,
  isPreview = true,
}: ICuotaPreviewProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "flex-start",
      }}
    >
      {cuotas.months.map((month) => (
        <>
          <Box>
            <Typography sx={{ mb: 3 }} variant="h5">
              Cuota {isPreview ? "Nueva" : `${month}/${cuotas.year}`}
            </Typography>

            <Typography variant="body1">
              Cliente:{" "}
              {cuotas.customer &&
                formatFullName(
                  cuotas?.customer?.firstName,
                  cuotas?.customer?.lastName
                )}
            </Typography>
            <Typography variant="body1">{`Monto: ${formattedCurrency(
              cuotas.amount
            )}`}</Typography>
            <Typography variant="body1">{`Mes: ${month}`}</Typography>
            <Typography variant="body1">{`Año: ${cuotas.year}`}</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Tooltip
              title={`${
                cuotas.status == CuotaStatus.PENDING
                  ? "Pendiente de Pago"
                  : "Sin servicio"
              }`}
            >
              <Circle
                fontSize="large"
                color={
                  cuotas.status === CuotaStatus.PENDING
                    ? "info"
                    : // : cuotas.status === CuotaStatus.LATE
                      // ? "warning"
                      "error"
                }
              />
            </Tooltip>
          </Box>
        </>
      ))}
    </Paper>
  );
}
