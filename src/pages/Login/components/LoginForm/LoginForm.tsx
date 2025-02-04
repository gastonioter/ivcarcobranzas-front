import { PrivateRoutes } from "@/models/routes";
import { store } from "@/redux";
import { setCredentials } from "@/redux/slices/auth";
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

export function LoginForm() {
  const navigate = useNavigate();
  const [login, { isError, isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const { password, email } = Object.fromEntries(formData.entries());
    try {
      const { token } = await login({
        password,
        email,
      }).unwrap();

      navigate(`/${PrivateRoutes.PRIVATE}`);
      store.dispatch(setCredentials({ token }));
    } catch (e) {
      console.log(e);
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

          {isError && (
            <Typography color="error">
              Credenciales incorrectas, por favor intente de nuevo.
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
