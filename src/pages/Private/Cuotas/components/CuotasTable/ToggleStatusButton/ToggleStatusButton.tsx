import { useSnackbar } from "@/context/SnackbarContext";

import { Cuota, CuotaStatus } from "@/models/Cuota";
import {
  useReactivateCuotaMutation,
  useAnularCuotaMutation,
} from "@/services/cuotasApi";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";
export default function ToggleStatusButton({
  status,
  row,
}: {
  status: CuotaStatus;
  row: Cuota;
}) {
  const snackbar = useSnackbar();

  const [reactivate] = useReactivateCuotaMutation();
  const [anular] = useAnularCuotaMutation();

  return status === CuotaStatus.NO_SERVICE ? (
    <Tooltip title="Activar Cuota" arrow>
      <IconButton
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await reactivate(row.uuid).unwrap();
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
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await anular(row.uuid).unwrap();
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
