import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetMetricsQuery } from "@/services/metricsApi";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Alert, Skeleton } from "@mui/material";
import { MetricCard } from "./components/MetricCard/MetricCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import { formattedCurrency } from "@/utilities/formatPrice";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { MetricsLayout } from "./styled-components/dahsboard-layout.styled.component";
export default function Dashboard() {
  const { data: metrics, isLoading, error } = useGetMetricsQuery();

  const { actives = 0, inactives = 0 } = metrics || {};
  if (error) {
    <Alert severity="error">Ocurrio un error al cargar esta pagina</Alert>;
  }

  const loading = !metrics || isLoading;

  return (
    <>
      <SectionHeader showButton={false}>
        <SectionTitle>Dashboard</SectionTitle>
      </SectionHeader>

      <MetricsLayout>
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={actives}
            icon={<GroupAddIcon fontSize="large" />}
            title="Clientes Activos"
            description="Total de clientes activos"
          ></MetricCard>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={inactives}
            title="Clientes De Baja"
            icon={<GroupRemoveIcon fontSize="large" />}
            description="Total de clientes dados de baja"
          ></MetricCard>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={metrics.generatedCutoas}
            title="Cuotas Generadas"
            icon={<SummarizeIcon fontSize="large" />}
            description="Total de cuotas generadas para el mes corriente"
          ></MetricCard>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={formattedCurrency(metrics.totalPaidAmounth)}
            title="Recaudado por Monitoreo"
            icon={<MonetizationOnIcon fontSize="large" />}
            description="Total cobrado por monitoreo en el mes corriente"
          ></MetricCard>
        )}
      </MetricsLayout>
    </>
  );
}
