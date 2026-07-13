import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router";
import CuotaForm from "./components/CuotaForm/CuotaForm";

export default function NewCuota() {
  const navigate = useNavigate();

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
        <CuotaForm />
      </Paper>
    </>
  );
}
