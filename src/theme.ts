import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0A3B9C", // Color principal (azul por defecto)
      dark: "#090C9C", // Variación oscura
      contrastText: "#ffffff", // Texto en botones y fondos primarios
    },
    secondary: {
      main: "#0A659C", // Color secundario (morado por defecto)
      contrastText: "#ffffff",
    },
    error: {
      main: "#D32F2F", // Color de error
    },
    success: {
      main: "#388E3C", // Color de éxito
    },
    warning: {
      main: "#FFA000", // Color de advertencia
    },
    info: {
      main: "#0288D1", // Color de información
    },
    background: {
      default: "#f5f5f5", // Fondo general
      paper: "#ffffff", // Fondo de tarjetas y contenedores
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontSize: "91px" },
    h2: { fontSize: "57px" },
    h3: { fontSize: "45px" },
    h4: { fontSize: "32px" },
    h5: { fontSize: "23px" },
    h6: { fontSize: "19px" },
    body1: { fontSize: "15px" },
    body2: { fontSize: "13px" },
    subtitle1: { fontSize: "15px" },
    subtitle2: { fontSize: "13px" },
    button: { fontSize: "13px" },
    overline: { fontSize: "9px" },
    caption: { fontSize: "11px" },
  },
  spacing: 4,
});

export default theme;
