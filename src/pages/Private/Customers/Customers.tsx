import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Typography } from "@mui/material";
import CustomerForm from "./components/CustomerForm/CustomerForm";
import CustomersTable from "./components/CustomersTable/CustomersTable";
import { useState } from "react";
import { Customer } from "@/models/customer";

function Customers() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <>
      <SectionHeader>
        <SectionTitle>Clientes</SectionTitle>
      </SectionHeader>

      <CustomersTable setCustomer={setCustomer} />

      <CustomDialog>
        <Box sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            {customer ? "Editar" : "Nuevo"} Cliente
          </Typography>
          <CustomerForm customer={customer} setCostumer={setCustomer} />
        </Box>
      </CustomDialog>
    </>
  );
}

export default Customers;
