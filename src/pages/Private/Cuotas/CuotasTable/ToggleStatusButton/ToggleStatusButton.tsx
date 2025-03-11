import { useSnackbar } from "@/context/SnackbarContext";

import { Cuota, CuotaStatus } from "@/models/Cuota";
import { useUpdateCuotaMutation } from "@/services/cuotasApi";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";
export default function ToggleStatusButton({
  status,
  customerId,
  row,
}: {
  status: CuotaStatus;
  customerId: string;
  row: Cuota;
}) {
  const snackbar = useSnackbar();

  const [updateStatus] = useUpdateCuotaMutation();

  return status === CuotaStatus.NO_SERVICE ? (
    <Tooltip title="Activar Cuota" arrow>
      <IconButton
        onClick={async () => {
          try {
            await updateStatus({
              cuotaId: row.uuid,
              serie: row.serie,
              status: CuotaStatus.PENDING,
              customerId,
            }).unwrap();
            snackbar.openSnackbar("Cuota activa!");
          } catch (e) {
            snackbar.openSnackbar(e.data.error, "error");
          }
        }}
      >
        <CheckIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Anular cuota" arrow>
      <IconButton
        onClick={async () => {
          try {
            await updateStatus({
              cuotaId: row.uuid,
              serie: row.serie,
              status: CuotaStatus.NO_SERVICE,
              customerId,
            }).unwrap();
            snackbar.openSnackbar("Cuota anulada!");
          } catch (e) {
            snackbar.openSnackbar(e.data.error, "error");
          }
        }}
      >
        <BlockIcon />
      </IconButton>
    </Tooltip>
  );
}
