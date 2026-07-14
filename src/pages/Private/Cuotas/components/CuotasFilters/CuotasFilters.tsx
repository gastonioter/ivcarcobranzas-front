// components/CuotasFilters/CuotasFilters.tsx
import { CuotaStatus, MonthsMap } from "@/models/Cuota";
import ClearIcon from "@mui/icons-material/Clear";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Button,
} from "@mui/material";
import { useCuotasURLFilters } from "../CuotasTable/hooks/useCuotasURLFilters";

// Generar una lista dinámica de años (ej. los últimos 5 años)
const YEARS = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

export default function CuotasFilters() {
  const { filters, setFilter, clearFilter, clearAllFilters, hasActiveFilters } =
    useCuotasURLFilters();

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mb: 2 }}
      alignItems="center"
      flexWrap="wrap"
      gap={1}
    >
      {/* Mes Desde */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="month-start-label">Mes Desde</InputLabel>
        <Select
          labelId="month-start-label"
          value={filters.monthStart || ""}
          label="Mes Desde"
          onChange={(e: SelectChangeEvent<any>) =>
            setFilter("monthStart", e.target.value)
          }
          endAdornment={
            filters.monthStart && (
              <IconButton
                size="small"
                onClick={() => clearFilter("monthStart")}
                sx={{ marginRight: 1.5 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          {MonthsMap.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Mes Hasta */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="month-end-label">Mes Hasta</InputLabel>
        <Select
          labelId="month-end-label"
          value={filters.monthEnd || ""}
          label="Mes Hasta"
          onChange={(e: SelectChangeEvent<any>) =>
            setFilter("monthEnd", e.target.value)
          }
          endAdornment={
            filters.monthEnd && (
              <IconButton
                size="small"
                onClick={() => clearFilter("monthEnd")}
                sx={{ marginRight: 1.5 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          {MonthsMap.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Año */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="year-label">Año</InputLabel>
        <Select
          labelId="year-label"
          value={filters.year || ""}
          label="Año"
          onChange={(e: SelectChangeEvent<any>) =>
            setFilter("year", e.target.value)
          }
          endAdornment={
            filters.year && (
              <IconButton
                size="small"
                onClick={() => clearFilter("year")}
                sx={{ marginRight: 1.5 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          {YEARS.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Estado */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="status-label">Estado</InputLabel>
        <Select
          labelId="status-label"
          value={filters.status || ""}
          label="Estado"
          onChange={(e: SelectChangeEvent<any>) =>
            setFilter("status", e.target.value)
          }
          endAdornment={
            filters.status && (
              <IconButton
                size="small"
                onClick={() => clearFilter("status")}
                sx={{ marginRight: 1.5 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          <MenuItem value={CuotaStatus.PENDING}>Pendiente</MenuItem>
          <MenuItem value={CuotaStatus.PAID}>Pagado</MenuItem>
          <MenuItem value={CuotaStatus.NO_SERVICE}>Sin Servicio</MenuItem>
        </Select>
      </FormControl>

      {/* Botón de limpiar todo */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={clearAllFilters}
          startIcon={<ClearIcon />}
        >
          Limpiar Filtros
        </Button>
      )}
    </Stack>
  );
}
