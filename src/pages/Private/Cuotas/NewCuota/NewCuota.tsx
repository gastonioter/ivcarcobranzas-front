import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Paper } from "@mui/material";

export default function NewCuota() {
  return (
    <>
      <SectionHeader showButton={false}>
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
