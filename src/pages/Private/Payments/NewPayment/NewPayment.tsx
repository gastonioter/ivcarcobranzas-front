import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NewPaymentForm from "./NewPaymentForm/NewPaymentForm";
import { Paper } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetCustomerQuery } from "@/services/customerApi";

export default function NewPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const customerId = searchParams.get("customerId");

  const { data: customer } = useGetCustomerQuery(customerId || "", {
    skip: !customerId,
  });

  return (
    <>
      <SectionHeader
        customClickHandler={() => {
          navigate(-1);
        }}
        buttonProps={{
          text: "Atras",
          variant: "outlined",
          icon: <ArrowBackIcon />,
        }}
      >
        <SectionTitle>Nuevo Pago</SectionTitle>
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
        <NewPaymentForm customer={customer} />
      </Paper>
    </>
  );
}
