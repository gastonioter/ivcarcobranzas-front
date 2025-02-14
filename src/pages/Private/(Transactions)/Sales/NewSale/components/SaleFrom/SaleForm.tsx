import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import BaseTransactionForm from "@/pages/Private/(Transactions)/components/BaseTransactionForm/BaseTransactionForm";
import { useTransactionContext } from "@/pages/Private/(Transactions)/context/TransactionContext";
import { useCreateSaleMutation } from "@/services/saleApi";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SaleForm() {
  const [discount, setDiscount] = useState<number>(0);

  const user = useUserData();
  const navigate = useNavigate();
  const { transaction } = useTransactionContext();
  const snackbar = useSnackbar();
  const [create] = useCreateSaleMutation();
  const handleSubmit = async () => {
    const { customerId, details, iva } = transaction;
    try {
      await create({
        customerId,
        details,
        iva,
        sellerId: user?.userId as string,
      }).unwrap();
      snackbar.openSnackbar("Presupuesto creado con exito!");
      navigate(-1);
    } catch (e) {
      snackbar.openSnackbar(e.data.error, "error");
    }
  };

  return (
    <BaseTransactionForm onSumbit={handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TextField
          label="Descuento?"
          size="small"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(+e.target.value)}
          helperText="Ingresa el descuento en porcentaje"
        />
      </LocalizationProvider>
    </BaseTransactionForm>
  );
}
