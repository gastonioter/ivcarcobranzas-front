import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { PrivateRoutes } from "@/models";
import { useNavigate } from "react-router";

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

      {/* <BudgetsTable /> */}
    </>
  );
}
