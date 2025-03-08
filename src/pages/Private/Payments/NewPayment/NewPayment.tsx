import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NewPayment() {
  const navigate = useNavigate();
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
    </>
  );
}
