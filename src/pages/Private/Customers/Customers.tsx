import { CustomDialog } from "@/components/CustomDialog";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { Box, Typography } from "@mui/material";
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
        <Box sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            Nuevo Cliente
          </Typography>
          <CustomerForm />
        </Box>
      </CustomDialog>
    </>
  );
}

export default Customers;
