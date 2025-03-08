import { Box } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

export function CustomGridToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton
        slotProps={{
          tooltip: {
            title: "Seleccionar columnas",
          },
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter placeholder="Buscar" />
    </GridToolbarContainer>
  );
}
