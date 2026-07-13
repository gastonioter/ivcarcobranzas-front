import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetMetricsQuery } from "@/services/metricsApi";
import { summarizeAmount } from "@/utilities/summarizeAmount";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Alert, Button, Link, Skeleton } from "@mui/material";
import { useNavigate } from "react-router";
import { MetricCard } from "./components/MetricCard/MetricCard";
import { MetricsLayout } from "./styled-components/dahsboard-layout.styled.component";
import { DeudoresTable } from "./components/DeudoresTable";
import { RevenueChart } from "./components/RevenueChart/RevenueChart";
import { ClientesPieChart } from "./components/ClientesPieChart/ClientesPieChart";
import { formattedCurrency } from "@/utilities/formatPrice";
export default function Dashboard() {
  const { data: metrics, isLoading, error } = useGetMetricsQuery();

  const navigate = useNavigate();
  const {
    actives = 0,
    inactives = 0,
    deudores,
    totalGeneratedCutoas = 0,
    totalPaidCuotas = 0,
    totalRevenue = 0,
  } = metrics || {};
  if (error) {
    <Alert severity="error">Ocurrio un error al cargar esta pagina</Alert>;
  }

  const loading = !metrics || isLoading;

  return (
    <>
      <MetricsLayout>
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={actives}
            icon={<GroupAddIcon fontSize="large" />}
            title="Clientes Activos"
            color="success"
            description="Total de clientes activos"
          ></MetricCard>
        )}

        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={inactives}
            title="Clientes De Baja"
            color="error"
            icon={<GroupRemoveIcon fontSize="large" />}
            description="Total de clientes dados de baja"
          ></MetricCard>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={`${((totalPaidCuotas / totalGeneratedCutoas) * 100).toFixed(
              1,
            )}%`}
            title="Tasa de pagos"
            color={`${
              totalPaidCuotas / totalGeneratedCutoas < 0.5 ? "error" : "success"
            }`}
            icon={<MonetizationOnIcon fontSize="large" />}
            description={`Se pagaron ${totalPaidCuotas} cuotas de ${totalGeneratedCutoas} generadas este mes
            `}
          ></MetricCard>
        )}
        {/* {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={totalGeneratedCutoas || 0}
            title="Cuotas Generadas"
            icon={<SummarizeIcon fontSize="large" />}
            description="Total de cuotas generadas para el mes corriente"
          ></MetricCard>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={totalPaidCuotas || 0}
            title="Cuotas Pagadas"
            icon={<SummarizeIcon fontSize="large" />}
            description="Total de cuotas pagadas en este mes"
          ></MetricCard>
        )} */}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={formattedCurrency(totalRevenue)}
            title="Recaudado por Monitoreo"
            color="success"
            icon={<MonetizationOnIcon fontSize="large" />}
            description="Total cobrado por monitoreo en el mes corriente"
          ></MetricCard>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            sx={{ gridColumn: "span 2" }}
            value={deudores?.length || 0}
            icon={<AccountBalanceWalletIcon fontSize="large" />}
            title="Clientes Deudores"
            description="Clientes que tienen mas de 3 meses sin pagar."
            color="error"
          >
            <Link
              component="button"
              onClick={() => {
                dialogOpenSubject$.setSubject = true;
              }}
            >
              Ver detalles
            </Link>
          </MetricCard>
        )}
      </MetricsLayout>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginTop: "1rem" }}>
        <RevenueChart />
        <ClientesPieChart actives={actives} inactives={inactives} />
      </div>

      <CustomDialog
        title="Clientes Deudores"
        sx={{
          height: "600px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {loading ? <Skeleton /> : <DeudoresTable deudores={deudores} />}
        <Button
          variant="outlined"
          onClick={() => (dialogCloseSubject$.setSubject = false)}
          sx={{ alignSelf: "flex-end", mt: 2 }}
        >
          Cerrar
        </Button>
      </CustomDialog>
    </>
  );
}
