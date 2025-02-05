import { useGetSaleQuery } from "@/services/saleApi";
import { Alert, Paper } from "@mui/material";
import { useParams } from "react-router";
import SaleForm from "../components/SaleForm/SaleForm";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";

export default function DetailSale() {
  //const snackbar = useSnackbar();
  const { uuid } = useParams();

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
      <SectionHeader showButton={false}>
        <SectionTitle>Detalle de Venta</SectionTitle>
      </SectionHeader>

      <Paper sx={{ p: 2, height: "100%" }}>
        {sale && <SaleForm sale={sale} />}
      </Paper>
    </>
  );
}
