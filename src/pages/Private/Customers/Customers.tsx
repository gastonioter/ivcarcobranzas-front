import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Customer } from "@/models/customer";
import { useState } from "react";
import CustomerForm from "./components/CustomerForm/CustomerForm";
import CustomersTable from "./components/CustomersTable/CustomersTable";

function Customers() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <>
      <SectionHeader>
        <SectionTitle>Clientes</SectionTitle>
      </SectionHeader>

      <CustomersTable setCustomer={setCustomer} />

      <CustomDialog title={customer ? "Editar Cliente" : "Nuevo Cliente"}>
        <CustomerForm customer={customer} setCostumer={setCustomer} />
      </CustomDialog>
    </>
  );
}

export default Customers;
