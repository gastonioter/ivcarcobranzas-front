import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  useGetSettingsQuery,
  useSetSettingsMutation,
} from "@/services/settingsApi";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Settings() {
  const snackbar = useSnackbar();
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [setSettings, { isLoading: isSaving }] = useSetSettingsMutation();

  const [precioCuota, setPrecioCuota] = useState("");

  useEffect(() => {
    if (settings?.globalCuotaPrice !== undefined) {
      setPrecioCuota(String(settings.globalCuotaPrice));
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await setSettings({ globalCuotaPrice: Number(precioCuota) }).unwrap();
      snackbar.openSnackbar("Configuración guardada con éxito");
    } catch (e: any) {
      snackbar.openSnackbar(`${e?.data?.error || "Error al guardar"}`, "error");
    }
  };

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
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={28} />
          </Box>
        ) : (
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
              <Button
                variant="contained"
                onClick={handleSave}
                loading={isSaving}
                disabled={precioCuota === ""}
              >
                Guardar
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>
    </>
  );
}
