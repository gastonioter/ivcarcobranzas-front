import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import SaleForm from "../components/SaleForm/SaleForm";
import { Paper } from "@mui/material";

export default function NewSale() {
  return (
    <>
      <SectionHeader showButton={false}>
        <SectionTitle>Nueva Venta</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 2 , height: "100%" }}>
        <SaleForm />
      </Paper>
    </>
  );
}
