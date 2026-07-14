import { useSearchParams } from "react-router-dom";
import { CuotaStatus } from "@/models/Cuota";
import { CuotaFilters } from "@/models/Cuota";

export function useCuotasURLFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CuotaFilters = {
    customerId: searchParams.get("customerId") || undefined,
    monthStart: searchParams.get("monthStart")
      ? Number(searchParams.get("monthStart"))
      : undefined,
    monthEnd: searchParams.get("monthEnd")
      ? Number(searchParams.get("monthEnd"))
      : undefined,
    year: searchParams.get("year")
      ? Number(searchParams.get("year"))
      : undefined,
    status: (searchParams.get("status") as CuotaStatus) || undefined,
  };

  const setFilter = (
    key: keyof CuotaFilters,
    value: string | number | undefined,
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams);
  };

  const clearFilter = (key: keyof CuotaFilters) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    const customerId = searchParams.get("customerId");
    if (customerId) {
      newParams.set("customerId", customerId);
    }
    setSearchParams(newParams);
  };

  const hasActiveFilters = !!(
    filters.monthStart ||
    filters.monthEnd ||
    filters.year ||
    filters.status
  );

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  };
}
