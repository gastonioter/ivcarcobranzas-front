import { Stack, Button } from "@mui/material";
import { dialogCloseSubject$ } from "../CustomDialog";

export default function FooterCustomDialog({ onClose, isLoading, editMode }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onClose();
          dialogCloseSubject$.setSubject = true;
        }}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        loading={isLoading}
        loadingPosition="end"
      >
        {editMode ? "Editar" : "Agregar"}
      </Button>
    </Stack>
  );
}
