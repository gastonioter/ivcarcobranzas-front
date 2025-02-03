import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useGetCategoriesQuery } from "@/services/categoriesApi";
import { Box, Typography } from "@mui/material";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import CategoryForm from "./components/CategoryForm/CategoryForm";
export default function Categories() {
  const { data, isLoading, error } = useGetCategoriesQuery();

  return (
    <>
      <SectionHeader>
        <SectionTitle>Categorías</SectionTitle>
      </SectionHeader>

      <CategoriesTable data={data} isLoading={isLoading} error={error} />

      <CustomDialog>
        <Box sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            Nueva Categoría
          </Typography>
          <CategoryForm />
        </Box>
      </CustomDialog>
    </>
  );
}
