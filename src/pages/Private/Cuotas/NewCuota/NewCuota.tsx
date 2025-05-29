import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetCustomerQuery } from "@/services/customerApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import CuotaForm from "./components/CuotaForm/CuotaForm";

export default function NewCuota() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const customerId = searchParams.get("customerId");

  const { data } = useGetCustomerQuery(customerId || "", {
    skip: !customerId,
  });

  return (
    <>
      <SectionHeader
        buttonProps={{
          text: "Atras",
          variant: "outlined",
          icon: <ArrowBackIcon />,
        }}
        customClickHandler={() => {
          navigate(-1);
        }}
      >
        <SectionTitle>Nueva Cuota</SectionTitle>
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
        <CuotaForm customer={data} />
      </Paper>
    </>
  );
}
