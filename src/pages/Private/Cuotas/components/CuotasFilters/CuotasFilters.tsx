import * as React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { CuotaStatus } from "@/models/Cuota";
import { filters } from "../CuotasTable/CuotasTable";

const yearsOpts = [
  { value: "sinaplicar", label: "Todos" },
  { value: new Date().getFullYear() - 1, label: new Date().getFullYear() - 1 },
  { value: new Date().getFullYear(), label: new Date().getFullYear() },
  { value: new Date().getFullYear() + 1, label: new Date().getFullYear() + 1 },
];

const monthOpts = [
  { value: "sinaplicar", label: "Todos" },
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
interface ICuotasFiltersProps {
  setFilters: React.Dispatch<React.SetStateAction<filters>>;
  filters: filters;
}
export default function CuotasFilters({
  setFilters,
  filters,
}: ICuotasFiltersProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 3,
        px: 2,
        border: "1px solid #ddd",
      }}
    >
      <Typography variant="h6">Filtrar cuotas</Typography>
      <FormControl>
        <InputLabel>Año</InputLabel>
        <Select
          label="Año"
          size="small"
          value={filters.year}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              year: e.target.value as number,
            }));
          }}
        >
          {yearsOpts.map((year) => (
            <MenuItem value={year.value}>{year.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Mes</InputLabel>
        <Select
          label="mes"
          size="small"
          value={filters.month}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              month: e.target.value as number,
            }));
          }}
        >
          {monthOpts.map((month) => (
            <MenuItem value={month.value}>{month.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Estado</InputLabel>
        <Select
          label="Estado"
          size="small"
          value={filters.status}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              status: e.target.value as CuotaStatus,
            }));
          }}
        >
          {Object.values(CuotaStatus).map((status) => (
            <MenuItem value={status}>{status.toUpperCase()}</MenuItem>
          ))}
          <MenuItem value={"sinaplicar"}>{"Todos"}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
