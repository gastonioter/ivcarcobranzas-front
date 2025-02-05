import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <SectionHeader showButton={false}>
        <SectionTitle>Dashboard</SectionTitle>
      </SectionHeader>

      <Paper></Paper>
    </>
  );
}
