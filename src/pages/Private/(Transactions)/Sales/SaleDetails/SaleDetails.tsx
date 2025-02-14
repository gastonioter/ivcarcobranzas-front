import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetSaleQuery } from "@/services/saleApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Paper } from "@mui/material";

import { useNavigate, useParams } from "react-router";

export default function SaleDetails() {
  //const snackbar = useSnackbar();
  const { uuid } = useParams();
  const navigate = useNavigate();

  const {
    data: sale,
    isLoading: isLoadingSale,
    error: errorSale,
  } = useGetSaleQuery(uuid ?? "");

  console.log(sale);
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

      <Paper sx={{ p: 2, height: "100%" }}></Paper>
    </>
  );
}
