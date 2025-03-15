import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

export function CustomGridToolbar() {
  return (
    <GridToolbarContainer sx={{ display: {
      xs: "block",
      sm: "flex",
    }, gap:2,px:2 }}>
      <GridToolbarColumnsButton
        slotProps={{
          tooltip: {
            title: "Seleccionar columnas",
          },
        }}
      />

      <GridToolbarQuickFilter
        placeholder="Buscar por nombre, celular, CUIT"
        sx={{  flex:1,p:1 }}
      />
    </GridToolbarContainer>
  );
}
