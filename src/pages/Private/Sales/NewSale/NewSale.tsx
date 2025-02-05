import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import SaleForm from "../components/SaleForm/SaleForm";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
        <SectionTitle>Nueva Venta</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 2, height: "100%" }}>
        <SaleForm />
      </Paper>
    </>
  );
}
