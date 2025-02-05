import { useGetSaleQuery } from "@/services/saleApi";
import { Alert } from "@mui/material";
import { useParams } from "react-router";
import SaleForm from "../components/SaleForm/SaleForm";

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

  return sale ? <SaleForm sale={sale} /> : null;
}
