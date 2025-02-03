import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Typography } from "@mui/material";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsTable from "./components/ProductsTable/ProductsTable";

export default function Products() {
  return (
    <>
      <SectionHeader>
        <SectionTitle>Productos</SectionTitle>
      </SectionHeader>

      <ProductsTable />

      <CustomDialog>
        <Box sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            Nuevo Producto
          </Typography>
          <ProductForm />
        </Box>
      </CustomDialog>
    </>
  );
}
