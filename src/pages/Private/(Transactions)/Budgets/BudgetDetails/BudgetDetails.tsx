import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetBudgetQuery } from "@/services/budgetApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import BudgetForm from "../NewBudget/components/BudgetFrom/BudgetFrom";
import { TransactionProvider } from "../../context/TransactionContext";

export default function BudgetDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const {
    data: budget,
    isLoading: isLoadingSale,
    error: errorSale,
  } = useGetBudgetQuery(uuid ?? "");

  if (errorSale) {
    return (
      <Alert severity="error">Ocurrió un error al cargar el presupuesto</Alert>
    );
  }

  if (isLoadingSale) {
    return <Alert severity="info">Cargando presupuesto...</Alert>;
  }
  return (
    <>
      <SectionHeader
        showButton={true}
        buttonProps={{
          text: "Atras",
          variant: "outlined",
          icon: <ArrowBackIcon />,
        }}
        customClickHandler={() => {
          navigate(-1);
        }}
      >
        <SectionTitle>Detalle de Presupuesto Nro: {budget?.serie}</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 2 }}>
        <TransactionProvider>
          <BudgetForm budget={budget} />
        </TransactionProvider>
      </Paper>
    </>
  );
}
