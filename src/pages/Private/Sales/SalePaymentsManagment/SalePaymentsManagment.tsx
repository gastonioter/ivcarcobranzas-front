import { CustomDialog, dialogOpenSubject$ } from "@/components";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetSaleQuery } from "@/services/saleApi";
import { formatFullName } from "@/utilities/formatFullName";
import { AddCircleRounded } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import SalePaymentForm from "./components/SalePaymentForm/SalePaymentForm";
import SalePaymentsTable from "./components/SalePaymentsTable/SalePaymentsTable";
import SalePaymentSummary from "./components/SalePaymentSummary/SalePaymentSummary";

export default function SalePaymentsManagment() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { data: sale, isLoading } = useGetSaleQuery(uuid as string);

  const back = () => {
    navigate(-1);
  };

  if (isLoading) return <CircularProgress size={50} color="primary" />;

  if (!sale) return null;

  return (
    <>
      <SectionHeader
        showButton={true}
        buttonProps={{
          text: "Atras",
          variant: "outlined",
          icon: <ArrowBackIcon />,
        }}
        customClickHandler={back}
      >
        <SectionTitle>
          Pagos de venta a{" "}
          <strong>
            {formatFullName(sale.customer.firstName, sale.customer.lastName)}
          </strong>
        </SectionTitle>
      </SectionHeader>

      <Stack
        justifyContent={"space-between"}
        direction="row"
        gap={2}
        flexWrap={"wrap"}
        sx={{ mb: 2 }}
      >
        <Button
          endIcon={<AddCircleRounded />}
          sx={{ width: "fit-content" }}
          variant={"contained"}
          onClick={() => {
            dialogOpenSubject$.setSubject = true;
          }}
          disabled={false} // si esta pagando no se puede agregar pagos
        >
          Crear Nuevo Pago
        </Button>
        <Button startIcon={<PrintIcon />} variant="outlined" color="info">
          Imprimir Resumen de pagos
        </Button>
      </Stack>

      <Stack
        gap={2}
        direction={{
          xs: "column",
          md: "row",
        }}
        flexWrap={"wrap"}
        sx={{ height: "100%" }}
      >
        <SalePaymentsTable />
        <SalePaymentSummary {...sale.summary} />
      </Stack>

      <CustomDialog>
        <Box sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            Nuevo Pago
          </Typography>
          <SalePaymentForm />
        </Box>
      </CustomDialog>
    </>
  );
}
