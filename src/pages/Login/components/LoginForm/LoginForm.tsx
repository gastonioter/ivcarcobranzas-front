import { PrivateRoutes } from "@/models/routes";

import { useLoginMutation } from "@/services/authApi";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent } from "react";
import logo from "../../../../assets/logo-azul.png";

import { useNavigate } from "react-router";
import { useSnackbar } from "@/context/SnackbarContext";

export function LoginForm() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const snackbar = useSnackbar();
  console.log(import.meta.env.BASE_URL);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const { password, email } = Object.fromEntries(formData.entries());
    try {
      await login({
        password: password as string,
        email: email as string,
      }).unwrap();

      navigate(`/${PrivateRoutes.PRIVATE}`);
    } catch (e) {
      snackbar.openSnackbar(e.data.error, "error");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ px: 6, pb: 8, pt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Iniciar Sesión a IvcarVentas
        </Typography>
        <img src={logo}></img>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Correo Electrónico"
            type="email"
            name="email"
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            required
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
