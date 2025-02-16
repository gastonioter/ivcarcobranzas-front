import { dialogCloseSubject$ } from "@/components";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {} from "@/models";
import { PaymentMethods } from "@/models/SalePayment";
import { useUpdateSaleMutation } from "@/services/saleApi";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useParams } from "react-router";

export default function SalePaymentForm() {
  const { uuid } = useParams();
  const [addPayment, { isLoading }] = useUpdateSaleMutation();
  const snackbar = useSnackbar();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const { amount, paymentMethod } = Object.fromEntries(formData.entries());

      if (isNaN(Number(amount))) {
        snackbar.openSnackbar("El monto de pago debe ser un número", "error");
        return;
      }

      await addPayment({
        uuid: uuid as string,
        payment: {
          type: "CREATE",
          amount: Number(amount),
          paymentMethod: paymentMethod as PaymentMethods,
        },
      }).unwrap();
      snackbar.openSnackbar("Pago agregado correctamente");
      dialogCloseSubject$.setSubject = true;
    } catch (e) {
      snackbar.openSnackbar(e.data.error, "error");
    }
  };
  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 5 }}
    >
      <TextField label="Monto de Pago" name="amount" />
      <FormControl>
        <InputLabel id="metodo">Seleccione el metodo de pago</InputLabel>
        <Select
          labelId="metodo"
          name="paymentMethod"
          label="Seleccione el metodo de pago"
        >
          {Object.values(PaymentMethods).map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FooterCustomDialog isLoading={isLoading} editMode={false} />
    </Box>
  );
}
