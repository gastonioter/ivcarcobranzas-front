import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import CategoryForm from "./components/CategoryForm/CategoryForm";
export default function Categories() {
  return (
    <>
      <SectionHeader>
        <SectionTitle>Categorías</SectionTitle>
      </SectionHeader>

      <CategoriesTable />

      <CustomDialog title="Nueva categoría">
        <CategoryForm />
      </CustomDialog>
    </>
  );
}
