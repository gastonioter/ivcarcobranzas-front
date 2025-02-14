import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router";
import BudgetForm from "./components/BudgetFrom/BudgetFrom";
import { TransactionProvider } from "../../context/TransactionContext";
export default function NewSale() {
  const navigate = useNavigate();
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
        <SectionTitle>Nuevo Presupuesto</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 2, height: "100%" }}>
        <TransactionProvider>
          <BudgetForm />
        </TransactionProvider>
      </Paper>
    </>
  );
}
