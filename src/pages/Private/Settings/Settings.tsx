import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Settings() {
  const [precioCuota, setPrecioCuota] = useState("");

  return (
    <>
      <SectionHeader showButton={false}>
        <SectionTitle>Configuración</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 3, boxShadow: 2, maxWidth: 480 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Cuotas
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={3}>
          <TextField
            label="Precio de cuota general"
            type="number"
            value={precioCuota}
            onChange={(e) => setPrecioCuota(e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="success">Guardar</Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
