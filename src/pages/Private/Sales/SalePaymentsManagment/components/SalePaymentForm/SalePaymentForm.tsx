import { dialogCloseSubject$ } from "@/components";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  AddSalePaymentFormData,
  addSalePaymentSchema,
  PaymentMethods,
} from "@/models";
import { useCreatePaymentForSaleMutation } from "@/services/saleApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export default function SalePaymentForm() {
  const { uuid } = useParams();
  const [create, { isLoading }] = useCreatePaymentForSaleMutation();
  const snackbar = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSalePaymentFormData>({
    resolver: zodResolver(addSalePaymentSchema),
  });

  const onSubmit = async (data: AddSalePaymentFormData) => {
    try {
      await create({ uuid: uuid as string, data }).unwrap();
      snackbar.openSnackbar("Pago creado con exito");
      dialogCloseSubject$.setSubject = true;
    } catch (e) {
      //console.error(e);
      snackbar.openSnackbar(e.data.error, "error");
    }
  };
  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <TextField
        label="Monto de Pago"
        {...register("amount")}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />
      <FormControl>
        <InputLabel id="metodo">Seleccione el metodo de pago</InputLabel>
        <Select
          labelId="metodo"
          defaultValue={PaymentMethods.CASH}
          label="Seleccione el metodo de pago"
          error={!!errors.paymentMethod}
          {...register("paymentMethod")}
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
