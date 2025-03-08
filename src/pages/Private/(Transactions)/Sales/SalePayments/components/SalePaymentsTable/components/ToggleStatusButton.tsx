import { SalePayment, SalePaymentStatus } from "@/models/SalePayment";
import { useUpdateSaleMutation } from "@/services/saleApi";
import { useSnackbar } from "@/context/SnackbarContext";

import BlockIcon from "@mui/icons-material/Block";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { IconButton, Tooltip } from "@mui/material";
export default function ToggleStatusButton({
  status,
  saleId,
  row,
}: {
  status: SalePaymentStatus;
  saleId: string;
  row: SalePayment;
}) {
  const snackbar = useSnackbar();

  const [updateStatus] = useUpdateSaleMutation();

  return status === SalePaymentStatus.CANCELLED ? (
    <Tooltip title="Activar Pago" arrow>
      <IconButton
        onClick={async () => {
          await updateStatus({
            uuid: saleId,
            payment: {
              uuid: row.uuid,
              type: "UPDATE",
              status: SalePaymentStatus.ACTIVE,
            },
          });
          snackbar.openSnackbar("Pago activado!");
        }}
      >
        <TaskAltIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Anular Pago" arrow>
      <IconButton
        onClick={async () => {
          await updateStatus({
            uuid: saleId,
            payment: {
              uuid: row.uuid,
              type: "UPDATE",
              status: SalePaymentStatus.CANCELLED,
            },
          });
          snackbar.openSnackbar("Pago anulado!");
        }}
      >
        <BlockIcon />
      </IconButton>
    </Tooltip>
  );
}
