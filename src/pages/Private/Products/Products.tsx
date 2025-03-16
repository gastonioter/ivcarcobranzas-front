import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Product } from "@/models/product";
import { useState } from "react";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsTable from "./components/ProductsTable/ProductsTable";

export default function Products() {
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  return (
    <>
      <SectionHeader>
        <SectionTitle>Productos</SectionTitle>
      </SectionHeader>

      <ProductsTable setProduct={setProductToEdit} />

      <CustomDialog
        title={productToEdit ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductForm product={productToEdit} setProduct={setProductToEdit} />
      </CustomDialog>
    </>
  );
}
