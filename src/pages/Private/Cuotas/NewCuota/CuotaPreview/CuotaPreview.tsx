import { Circle } from "@mui/icons-material";
import { newCuotaPayload } from "../CuotaForm/CuotaForm";

import { InitalCuotaStatus } from "@/models/Cuota";
import { formatFullName } from "@/utilities/formatFullName";
import { Box, Paper, Tooltip, Typography } from "@mui/material";

export interface ICuotaPreviewProps {
  cuota: newCuotaPayload;
}

export default function CuotaPreview({ cuota }: ICuotaPreviewProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "flex-start",
      }}
    >
      <Box>
        <Typography sx={{ mb: 3 }} variant="h5">
          Cuota Preview
        </Typography>

        <Typography variant="body1">
          Cliente:{" "}
          {cuota.customer &&
            formatFullName(
              cuota?.customer?.firstName,
              cuota?.customer?.lastName
            )}
        </Typography>
        <Typography variant="body1">{`Monto: ${cuota.amonut}`}</Typography>
        <Typography variant="body1">{`Mes: ${cuota.month}`}</Typography>
        <Typography variant="body1">{`Año: ${cuota.year}`}</Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Tooltip
          title={`${
            cuota.status == InitalCuotaStatus.PENDING
              ? "Pendiente de Pago"
              : "Sin servicio"
          }`}
        >
          <Circle
            fontSize="large"
            color={
              cuota.status === InitalCuotaStatus.PENDING ? "warning" : "error"
            }
          />
        </Tooltip>
      </Box>
    </Paper>
  );
}
