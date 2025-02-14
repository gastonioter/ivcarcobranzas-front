import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import BaseTransactionForm from "@/pages/Private/(Transactions)/components/BaseTransactionForm/BaseTransactionForm";
import { useTransactionContext } from "@/pages/Private/(Transactions)/context/TransactionContext";

import { useCreateBudgetMutation } from "@/services/budgetApi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function BudgetForm() {
  const [expiresAt, setExpiresAt] = useState<Dayjs | null>(null);
  const user = useUserData();
  const navigate = useNavigate();
  const { transaction } = useTransactionContext();
  const snackbar = useSnackbar();
  const [create] = useCreateBudgetMutation();
  const handleSubmit = async () => {
    const { customerId, details, iva } = transaction;
    try {
      await create({
        customerId,
        details,
        iva,
        sellerId: user?.userId as string,
        expiresAt: expiresAt?.toDate(),
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
        <DatePicker
          value={expiresAt}
          views={["year", "month", "day"]}
          format="DD/MM/YYYY"
          disablePast
          label="Fecha de Expiración (opcional)"
          onChange={(newValue) => setExpiresAt(newValue)}
        />
      </LocalizationProvider>
    </BaseTransactionForm>
  );
}
