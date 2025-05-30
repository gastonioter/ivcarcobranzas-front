import { CuotaStatus } from "@/models/Cuota";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCuotasURLFilters } from "../CuotasTable/hooks/useCuotasURLFilters";

const yearsOpts = [
  { value: new Date().getFullYear() - 1, label: new Date().getFullYear() - 1 },
  { value: new Date().getFullYear(), label: new Date().getFullYear() },
  { value: new Date().getFullYear() + 1, label: new Date().getFullYear() + 1 },
];

const monthOpts = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export default function CuotasFilters() {
  const { filters, setFilters } = useCuotasURLFilters();

  console.log("filters", filters);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        py: 3,
        px: 2,
        // border: "1px solid #ddd",
      }}
    >
      <Typography variant="h6">Filtrar</Typography>
      <FormControl fullWidth>
        <InputLabel>Año</InputLabel>
        <Select
          label="Año"
          size="small"
          value={filters.year || ""}
          onChange={(e) => setFilters({ year: e.target.value })}
        >
          {yearsOpts.map((year) => (
            <MenuItem key={year.value} value={year.value}>
              {year.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Mes</InputLabel>
        <Select
          label="mes"
          size="small"
          value={filters.month || ""}
          onChange={(e) => setFilters({ month: e.target.value })}
        >
          <MenuItem value="">
            <em>Mes</em>
          </MenuItem>
          {monthOpts.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Estado</InputLabel>
        <Select
          label="Estado"
          size="small"
          value={filters.status || ""}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          <MenuItem value="">
            <em>Estado</em>
          </MenuItem>
          {Object.values(CuotaStatus).map((status) => (
            <MenuItem key={status.toLocaleLowerCase()} value={status}>
              {status.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
