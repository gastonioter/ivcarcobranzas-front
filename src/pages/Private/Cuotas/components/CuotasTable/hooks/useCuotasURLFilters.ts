import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type CuotasFilterType = {
  year?: string;
  month?: string;
  status?: string;
  customerId?: string;
};

export const useCuotasURLFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CuotasFilterType = useMemo(() => {
    const status = searchParams.get("status") || undefined;
    const year = searchParams.get("year") || undefined;
    const month = searchParams.get("month") || undefined;

    return { status, year, month };
  }, [searchParams]);

  const setFilters = useCallback(
    (nuevoEstado: Partial<CuotasFilterType>) => {
      const customerId = searchParams.get("customerId") || undefined;

      const nuevosParams = new URLSearchParams();

      const actualizados: CuotasFilterType = {
        ...filters,
        customerId,
        ...nuevoEstado,
      };

      Object.entries(actualizados).forEach(([clave, valor]) => {
        if (valor) nuevosParams.set(clave, valor);
      });

      setSearchParams(nuevosParams);
    },
    [filters, searchParams, setSearchParams]
  );

  return { filters, setFilters };
};
