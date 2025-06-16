import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { CustomerModalidad } from "@/models";
import { useGetMetricsQuery } from "@/services/metricsApi";
import { formatFullName } from "@/utilities/formatFullName";
import { summarizeAmount } from "@/utilities/summarizeAmount";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Alert, Button, Link, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { MetricCard } from "./components/MetricCard/MetricCard";
import { MetricsLayout } from "./styled-components/dahsboard-layout.styled.component";
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
              1
            )}%`}
            title="Tasa de pagos"
            color={`${
              totalPaidCuotas / totalGeneratedCutoas < 0.5 ? "error" : "success"
            }`}
            icon={<GroupRemoveIcon fontSize="large" />}
            description={`Relacion entre las cuotas generadas y las que se pagaron ${totalPaidCuotas} pagas / ${totalGeneratedCutoas} generadas
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
            value={summarizeAmount(totalRevenue || 0)}
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
            description="Clientes que tienen 3 o mas meses atrasados"
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

      <CustomDialog
        title="Clientes Deudores"
        sx={{
          height: "600px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {loading ? (
          <Skeleton />
        ) : (
          <DataGrid
            rows={deudores || []}
            columns={[
              {
                field: "fullName",
                headerName: "Nombre Completo",
                editable: false,
                minWidth: 150,
                flex: 1,
                valueGetter: (value, row) => {
                  return formatFullName(row.firstName, row.lastName);
                },
              },
              {
                field: "phone",
                headerName: "Teléfono",
                flex: 1,
                minWidth: 100,
                sortable: false,
              },
              {
                field: "totalDebt",
                headerName: "Deuda Total",
                flex: 1,
                valueGetter: (_, row) => {
                  const cuotas =
                    row.modalidadData.modalidad == CustomerModalidad.CLOUD
                      ? row.modalidadData.cuotas
                      : [];
                  const totalDebt = cuotas.reduce(
                    (acc, curr) => acc + curr.amount,
                    0
                  );

                  return summarizeAmount(totalDebt);
                },
              },
              {
                field: "Acciones",
                headerName: "Acciones",
                flex: 1,
                minWidth: 100,
                sortable: false,
                renderCell: (params) => {
                  return (
                    <Button
                      onClick={() =>
                        navigate(
                          `/private/cuotas?customerId=${params.row.uuid}&status=PENDIENTE`
                        )
                      }
                    >
                      Ver Cuotas
                    </Button>
                  );
                },
              },
            ]}
            getRowId={(row) => row.uuid}
          />
        )}
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
