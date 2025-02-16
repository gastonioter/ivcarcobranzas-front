import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import { Budget, CreateBudgetSchema } from "@/models/Budget";
import BaseTransactionForm from "@/pages/Private/(Transactions)/components/BaseTransactionForm/BaseTransactionForm";

import { useSummary } from "@/pages/Private/(Transactions)/hooks/summary";
import { useCreateBudgetMutation } from "@/services/budgetApi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useTransaction } from "../../../../hooks/transaction";
export default function BudgetForm({ budget }: { budget?: Budget }) {
  const [expiresAt, setExpiresAt] = useState<Dayjs | null>(null);

  const snackbar = useSnackbar();
  const [create] = useCreateBudgetMutation();

  const user = useUserData();
  const navigate = useNavigate();

  const { readonly, customer, details } = useTransaction();
  const { iva } = useSummary();

  const dispatch = useDispatch();

  useEffect(() => {
    if (budget) {
      dispatch({
        type: "setTransaction",
        payload: budget,
      });
      setExpiresAt(budget.expiresAt ? dayjs(budget.expiresAt) : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget]);

  const handleSubmit = async () => {
    try {
      const result = CreateBudgetSchema.safeParse({
        customerId: customer.uuid,
        iva,
        sellerId: user?.userId as string,
        details,
        expiresAt: expiresAt?.toDate(),
      });
      if (!result.success) {
        snackbar.openSnackbar(`${result.error.errors[0].message}`, "error");
        return;
      }
      await create(result.data).unwrap();
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
          disabled={readonly}
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
