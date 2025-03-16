import { CustomDialog, dialogOpenSubject$ } from "@/components";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetSaleQuery } from "@/services/saleApi";
import { formatFullName } from "@/utilities/formatFullName";
import { AddCircleRounded } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import SalePaymentSummary from "./components/PaymentSummary/PaymentSummary";
import SalePaymentForm from "./components/SalePaymentForm/SalePaymentForm";
import SalePaymentsTable from "./components/SalePaymentsTable/SalePaymentsTable";
import { LayoutSalePayments } from "./styled-components/layout.styled.component";

export default function SalePayments() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { data: sale, isLoading, error } = useGetSaleQuery(uuid as string);

  const back = () => {
    navigate(-1);
  };

  if (isLoading) return <CircularProgress size={50} color="primary" />;

  if (error || !sale)
    return <Alert severity="error">No se encontró la venta</Alert>;

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

      <LayoutSalePayments>
        <Button
          endIcon={<AddCircleRounded />}
          sx={{ width: "fit-content", gridColumn: "1 / -1" }}
          variant={"contained"}
          onClick={() => {
            dialogOpenSubject$.setSubject = true;
          }}
          disabled={false} // si esta pagando no se puede agregar pagos
        >
          Crear Nuevo Pago
        </Button>
        <SalePaymentsTable />
        <SalePaymentSummary {...sale.summary} />
      </LayoutSalePayments>

      <CustomDialog title="Nuevo Pago">
        <SalePaymentForm />
      </CustomDialog>
    </>
  );
}
