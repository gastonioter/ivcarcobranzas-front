import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import CustomerForm from "./components/CustomerForm/CustomerForm";
import CustomersTable from "./components/CustomersTable/CustomersTable";

function Customers() {
  return (
    <>
      <SectionHeader>
        <SectionTitle>Clientes</SectionTitle>
      </SectionHeader>

      <CustomersTable />

      <CustomDialog>
        <CustomerForm />
      </CustomDialog>
    </>
  );
}

export default Customers;
