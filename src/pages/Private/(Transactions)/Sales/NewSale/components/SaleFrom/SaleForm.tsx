/* eslint-disable react-hooks/exhaustive-deps */
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import { TextField } from "@mui/material";

import { CreateSaleSchema, Sale } from "@/models";
import BaseTransactionForm from "@/pages/Private/(Transactions)/components/BaseTransactionForm/BaseTransactionForm";
import {
  useSummary,
  useSummaryDispatch,
} from "@/pages/Private/(Transactions)/hooks/summary";
import {
  useDispatch,
  useTransaction,
} from "@/pages/Private/(Transactions)/hooks/transaction";
import { useGetAccountSummaryQuery } from "@/services/customerApi";
import { useCreateSaleMutation } from "@/services/saleApi";
import { formattedCurrency } from "@/utilities/formatPrice";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getSubtotalAmount } from "@/pages/Private/(Transactions)/utils";
export default function SaleForm({ sale }: { sale?: Sale }) {
  const user = useUserData();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [create] = useCreateSaleMutation();

  const transaction = useTransaction();
  const dispatch = useDispatch();

  const { discount } = useSummary();
  const summaryDispatch = useSummaryDispatch();

  const { customer, details, readonly } = transaction;

  const customerId = customer.uuid;

  const { data: accountSummary, isLoading: isLoadingSummary } =
    useGetAccountSummaryQuery(customerId, {
      skip: !customerId,
    });

  const { iva } = useSummary();
  const total =
    getSubtotalAmount(details) + (getSubtotalAmount(details) * iva) / 100;

  useEffect(() => {
    /* Actualizo Transaction Store y Summary Store con la Sale que llega por 
    parametro al componente */

    if (sale) {
      dispatch({
        type: "setTransaction",
        payload: sale,
      });
      summaryDispatch({
        type: "update-discount",
        payload: sale.discount ?? 0,
      });
      summaryDispatch({
        type: "update-iva",
        payload: sale.iva,
      });
    }
  }, [sale]);

  useEffect(() => {
    if (discount > Math.abs(accountSummary?.saldo || 0)) {
      snackbar.openSnackbar(
        "El monto supera el saldo a favor del cliente",
        "error"
      );
    } else if (discount > total) {
      snackbar.openSnackbar(
        "El descuento supera el monto de la venta.",
        "error"
      );
    }
  }, [discount, accountSummary, total]);

  const handleSubmit = async () => {
    try {
      // El descuento no es valido
      if (discount > Math.abs(accountSummary?.saldo ?? 0) || discount > total) {
        snackbar.openSnackbar("El descuento no es valido", "error");
        return;
      }
      const result = CreateSaleSchema.safeParse({
        customerId: customer.uuid,
        iva,
        sellerId: user?.userId as string,
        details,
        discount,
      });
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
      {customer && accountSummary ? (
        <TextField
          label="Aplicar saldo a favor"
          type="number"
          disabled={readonly || accountSummary.saldo >= 0}
          value={discount}
          onChange={(e) => {
            const discount = Number(e.target.value);
            summaryDispatch({
              type: "update-discount",
              payload: !isNaN(discount) && discount >= 0 ? discount : 0,
            });
          }}
          error={discount > Math.abs(accountSummary.saldo) || discount > total}
          helperText={`${
            accountSummary.saldo < 0
              ? `El cliente tiene un saldo a favor de: ${formattedCurrency(
                  Math.abs(accountSummary.saldo)
                )}. Si se aplica sera usado como HABER en esta venta`
              : `El cliente tiene un saldo pendiente de ${formattedCurrency(
                  accountSummary.saldo
                )}`
          }`}
        />
      ) : isLoadingSummary ? (
        <Typography variant="body2" color="textSecondary">
          Cargando información de la cuenta...
        </Typography>
      ) : (
        <></>
      )}
    </BaseTransactionForm>
  );
}
