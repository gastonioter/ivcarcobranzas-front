import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetSaleQuery } from "@/services/saleApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Paper } from "@mui/material";

import { useNavigate, useParams } from "react-router";
import { TransactionProvider } from "../../context/TransactionContext";
import SaleForm from "../NewSale/components/SaleFrom/SaleForm";

export default function SaleDetails() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const {
    data: sale,
    isLoading: isLoadingSale,
    error: errorSale,
  } = useGetSaleQuery(uuid ?? "");

  if (errorSale) {
    return <Alert severity="error">Ocurrió un error al cargar la venta</Alert>;
  }

  if (isLoadingSale) {
    return <Alert severity="info">Cargando venta...</Alert>;
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
        <SectionTitle>Detalle de Venta Nro: {sale?.serie}</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 2}}>
        <TransactionProvider>
          <SaleForm sale={sale} />
        </TransactionProvider>
      </Paper>
    </>
  );
}
