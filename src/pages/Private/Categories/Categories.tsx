import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Paper } from "@mui/material";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
export default function Categories() {
  return (
    <div>
      <Box>
        <SectionHeader>
          <SectionTitle>Categorías</SectionTitle>
        </SectionHeader>

        <Paper style={{ height: 300, width: "100%" }}>
          <CategoriesTable />
        </Paper>
      </Box>
    </div>
  );
}
