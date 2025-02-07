import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import BudgetsTable from "./components/BudgetsTable/BudgetsTable";
import { useNavigate } from "react-router";
import { PrivateRoutes } from "@/models";

export default function Budgets() {
  const navigate = useNavigate();
  return (
    <>
      <SectionHeader
        customClickHandler={() => {
          navigate(`${PrivateRoutes.NEW_BUDGET}`);
        }}
      >
        <SectionTitle>Presupuestos</SectionTitle>
      </SectionHeader>

      <BudgetsTable />
    </>
  );
}
