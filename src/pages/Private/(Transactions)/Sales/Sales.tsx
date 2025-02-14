import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { PrivateRoutes } from "@/models";
import { useNavigate } from "react-router";
import SalesTable from "./components/SalesTable/SalesTable";

export default function Sales() {
  const navigate = useNavigate();
  return (
    <>
      <SectionHeader
        customClickHandler={() => {
          navigate(`${PrivateRoutes.NEW_SALE}`);
        }}
      >
        <SectionTitle>Ventas</SectionTitle>
      </SectionHeader>

      <SalesTable />
    </>
  );
}
