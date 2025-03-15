import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
export interface IConfirmationDialogProps {
  onConfirm: () => Promise<void>;
  open: boolean;
  loading: boolean;
  children: JSX.Element | string;
  close: () => void;
}

export default function ConfirmationDialog({
  open,
  onConfirm,
  loading,
  close,
  children,
}: IConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={3}>
          {<WarningAmberIcon fontSize="large" />}
          <Typography variant="h5" fontWeight="bold">
            Atención!
          </Typography>
        </Box>
        <DialogContent>
          <Typography variant="body1">{children}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={close}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            loading={loading}
            onClick={async () => {
              await onConfirm();
              close();
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </DialogTitle>
    </Dialog>
  );
}
