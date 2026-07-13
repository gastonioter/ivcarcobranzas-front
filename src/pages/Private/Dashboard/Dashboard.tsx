import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components";
import { MonitoreoRenevue, useGetMetricsQuery } from "@/services/metricsApi";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Alert, Button, Link, Skeleton } from "@mui/material";
import { ClientesPieChart } from "./components/ClientesPieChart/ClientesPieChart";
import { DeudoresTable } from "./components/DeudoresTable";
import { MetricCard } from "./components/MetricCard/MetricCard";
import { RevenueChart } from "./components/RevenueChart/RevenueChart";
import { MetricsLayout } from "./styled-components/dahsboard-layout.styled.component";
export default function Dashboard() {
  const { data: metrics, isLoading, error } = useGetMetricsQuery();

  const {
    actives = 0,
    inactives = 0,
    deudores,
    totalGeneratedCutoas = 0,
    totalPaidCuotas = 0,
    revenueByMonth = [],
  } = metrics || {};
  if (error) {
    <Alert severity="error">Ocurrio un error al cargar esta pagina</Alert>;
  }

  const loading = !metrics || isLoading;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <RevenueChart data={revenueByMonth as MonitoreoRenevue[]} />
        <ClientesPieChart actives={actives} inactives={inactives} />
      </div>
      <MetricsLayout>
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={`${((totalPaidCuotas / totalGeneratedCutoas) * 100).toFixed(
              1,
            )}%`}
            title="Monitoreo | Cuotas pagas"
            color={`${
              totalPaidCuotas / totalGeneratedCutoas < 0.5 ? "error" : "success"
            }`}
            icon={<MonetizationOnIcon fontSize="large" />}
            description={`Se pagaron ${totalPaidCuotas} cuotas de ${totalGeneratedCutoas} generadas este mes
            `}
          ></MetricCard>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={deudores?.length || 0}
            icon={<AccountBalanceWalletIcon fontSize="large" />}
            title="Monitoreo | Clientes Deudores"
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
        {/* {loading ? (
          <Skeleton />
        ) : (
          <MetricCard
            value={formattedCurrency(totalRevenue)}
            title="Recaudado por Monitoreo"
            color="success"
            icon={<MonetizationOnIcon fontSize="large" />}
            description="Total cobrado por monitoreo en el mes corriente"
          ></MetricCard>
        )} */}
      </MetricsLayout>

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
