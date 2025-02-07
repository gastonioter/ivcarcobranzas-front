import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { CustomDialog, dialogCloseSubject$ } from "../CustomDialog";
export interface IConfirmationDialogProps {
  message: JSX.Element;
  onConfirm: () => void;
  isDanger?: boolean;
}

export default function ConfirmationDialog({
  message,
  onConfirm,
  isDanger = false,
}: IConfirmationDialogProps) {
  return (
    <CustomDialog>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={3}>
            {isDanger && <WarningAmberIcon fontSize="large" />}
            <Typography variant="h5" fontWeight="bold">
              Atención!
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>

        <DialogActions
          onAuxClick={() => (dialogCloseSubject$.setSubject = true)}
        >
          <Button
            variant={`${isDanger ? "contained" : "outlined"}`}
            color="primary"
            onClick={() => {
              dialogCloseSubject$.setSubject = true;
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={`${isDanger ? "error" : "primary"}`}
            onClick={() => {
              onConfirm();
              dialogCloseSubject$.setSubject = true;
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Box>
    </CustomDialog>
  );
}
