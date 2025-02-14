import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import { Sale } from "@/models";
import { CreateTransactionSchema } from "@/models/Transaction";
import BaseTransactionForm from "@/pages/Private/(Transactions)/components/BaseTransactionForm/BaseTransactionForm";
import {
  useDispatch,
  useTransaction,
} from "@/pages/Private/(Transactions)/hooks";
import { useCreateSaleMutation } from "@/services/saleApi";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function SaleForm({ sale }: { sale?: Sale }) {
  const [discount, setDiscount] = useState<number>(0);

  const user = useUserData();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [create] = useCreateSaleMutation();
  const transaction = useTransaction();
  const dispatch = useDispatch();

  useEffect(() => {
    if (sale) {
      dispatch({
        type: "setState",
        payload: {
          editMode: true,
          details: sale.details,
          iva: sale.iva,
          //saleStatus: sale.status,
          customer: sale.customer,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sale]);

  const handleSubmit = async () => {
    try {
      const { customer, details, iva } = transaction;
      const result = CreateTransactionSchema.safeParse({
        customerId: customer.uuid,
        iva,
        sellerId: user?.userId as string,
        details,
      });
      console.log("Result:", result);
      if (!result.success) {
        snackbar.openSnackbar(`${result.error.errors[0].message}`, "error");
        return;
      }
      await create({
        ...result.data,
      }).unwrap();
      snackbar.openSnackbar("Venta creada con exito!");
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
