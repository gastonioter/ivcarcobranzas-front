import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Paper, Typography } from "@mui/material";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import { CustomDialog } from "@/components/CustomDialog";
import CategoryForm from "./components/CategoryForm/CategoryForm";
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

        <CustomDialog>
          <Box sx={{ p: 5 }}>
            <Typography variant="h5" sx={{ mb: 5 }}>
              Nueva Categoría
            </Typography>
            <CategoryForm />
          </Box>
        </CustomDialog>
      </Box>
    </div>
  );
}
