import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Paper } from "@mui/material";

import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Sale } from "@/models";
import { useNavigate } from "react-router";
import { TransactionProvider } from "../../context/TransactionContext";
import SaleForm from "./components/SaleFrom/SaleForm";
import SummaryProvider from "../../context/SummaryContext";

export default function NewSale({ sale }: { sale?: Sale }) {
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

      <Paper
        sx={{
          p: 2,
          height: {
            xs: "auto",
            md: "100%",
          },
        }}
      >
        <SummaryProvider>
          <TransactionProvider>
            <SaleForm sale={sale} />
          </TransactionProvider>
        </SummaryProvider>
      </Paper>
    </>
  );
}
