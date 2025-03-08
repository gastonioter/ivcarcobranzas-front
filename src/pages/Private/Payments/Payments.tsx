import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Paper } from "@mui/material";
import NewPaymentForm from "./NewPayment/NewPaymentForm/NewPaymentForm";

export default function Payments() {
  return (
    <>
      <SectionHeader showButton={false}>
        <SectionTitle>Registar Pago de Cuotas</SectionTitle>
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
        <NewPaymentForm />
      </Paper>
    </>
  );
}
