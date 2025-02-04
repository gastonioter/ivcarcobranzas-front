import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Typography } from "@mui/material";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsTable from "./components/ProductsTable/ProductsTable";
import { useState } from "react";
import { Product } from "@/models/product";

export default function Products() {
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  return (
    <>
      <SectionHeader>
        <SectionTitle>Productos</SectionTitle>
      </SectionHeader>

      <ProductsTable setProduct={setProductToEdit} />

      <CustomDialog>
        <Box sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            Nuevo Producto
          </Typography>
          <ProductForm product={productToEdit} setProduct={setProductToEdit} />
        </Box>
      </CustomDialog>
    </>
  );
}
