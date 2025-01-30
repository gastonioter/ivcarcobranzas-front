import { PrivateRoutes } from "@/models/routes";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent } from "react";
import { useNavigate } from "react-router";

export function LoginForm() {
  const navigate = useNavigate();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("auth", "true");
    navigate(`/${PrivateRoutes.PRIVATE}`);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión a IvcarVentas
        </Typography>
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
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
