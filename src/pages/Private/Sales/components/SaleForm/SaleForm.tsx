import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components/CustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import { Customer } from "@/models/customer";
import { Product } from "@/models/product";
import { Sale, SaleStatus } from "@/models/Sale";
import { useGetCustomersQuery } from "@/services/customerApi";
import { useGetProductsQuery } from "@/services/productApi";
import { useCreateSaleMutation } from "@/services/saleApi";
import { AddCircleRounded } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DetailsTable from "./components/DetailsTable/DetailsTable";
import ProductsForSaleTable from "./components/ProductsForSaleTable.tsx/ProductsForSaleTable";
import SaleSummary from "./components/SaleSummary/SaleSummary";
import {
  CreateTransactionSchema,
  Detail,
  TransactionFormData,
} from "@/models/Transaction";

export default function SaleForm({ sale }: { sale?: Sale }) {
  const [details, setDetails] = useState<Detail[]>([]);
  const snackbar = useSnackbar();
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [customer, setCustomer] = useState("");
  const [create, { isLoading }] = useCreateSaleMutation();
  const { userId } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    const newSubtotal = (details || []).reduce(
      (acc, item) => acc + Number(item.total),
      0
    );

    setSubtotal(newSubtotal);
  }, [details]);

  useEffect(() => {
    if (sale) {
      setDetails(sale.details || []);
      setTax(Number(sale.iva));
    }
  }, [sale]);



 
  

  const onSubmit = async (e) => {
    e.preventDefault();

    const data: TransactionFormData = {
      sellerId: userId,
      iva: tax,
      customerId: customer,
      details,
    };

    const result = CreateTransactionSchema.safeParse(data);

    if (result.success) {
      try {
        await create(result.data).unwrap();
      } catch (e) {
        console.error(e);
        snackbar.openSnackbar("Ups, algo salio mal...", "error");
      }
      snackbar.openSnackbar(`Venta creada con exito!`);
      navigate(-1);
    } else {
      snackbar.openSnackbar(result.error.issues[0].message, "error");
    }
  };
  return (
    <Box
      component={"form"}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Stack
        spacing={{
          xs: 0,
          sm: 4,
        }}
        direction={"row"}
        flexWrap={"wrap"}
      >
        <FormControl sx={{ flex: 2, flexBasis: 200 }}>
          <Autocomplete
            sx={{ width: "100%" }}
            onChange={(event, value) => {
              setCustomer(value?.uuid ?? "");
            }}
            disableClearable
            defaultValue={sale?.customer as Customer}
            disabledItemsFocusable
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
            readOnly={!!sale}
            getOptionLabel={(option: Customer) =>
              `${option.firstName} ${option.lastName}`
            }
            disabled={isLoadingCostumers}
            options={customers ?? []}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
        </FormControl>

        <TextField
          sx={{ flex: 1, flexBasis: 200 }}
          label={"IVA"}
          type="number"
          defaultValue={sale?.iva ?? 0}
          disabled={!!sale}
          onChange={(e) => {
            const tax: number = !Number.isNaN(parseFloat(e.target.value))
              ? parseInt(e.target.value)
              : 0;
            setTax(tax);
          }}
        ></TextField>
      </Stack>

      <Button
        endIcon={<AddCircleRounded />}
        sx={{ width: "fit-content" }}
        variant={"contained"}
        onClick={() => {
          dialogOpenSubject$.setSubject = true;
        }}
        disabled={isLoadingProducts || !!sale}
      >
        Agregar Productos
      </Button>

      <DetailsTable
        readOnly={!!sale}
        details={details}
        onDeleteItem={onDeleteItem}
        handleUpdateDetail={handleUpdateDetail}
      />

      <Stack spacing={2} direction={"row"} alignItems={"flex-end"}>
        <SaleSummary
          forBudget={false}
          subtotal={subtotal}
          tax={tax}
          sx={{ width: 400, maxWidth: "100%" }}
          isCancelled={sale?.status === SaleStatus.CANCELLED}
        />
        {!sale && (
          <Button
            sx={{ mr: "auto" }}
            loading={isLoading}
            variant="contained"
            color="success"
            onClick={onSubmit}
          >
            Crear Venta
          </Button>
        )}
      </Stack>
      <CustomDialog>
        <Box
          sx={{
            p: 4,
            display: "flex",
            gap: 2,
            flexDirection: "column",
            height: 600,
          }}
        >
          <Typography variant={"h6"}>Selecciona productos</Typography>
          <ProductsForSaleTable
            products={products || []}
            isLoading={isLoadingProducts}
            onClickRow={addDetailItem}
          />
          <Button
            sx={{ width: "fit-content" }}
            variant={"outlined"}
            onClick={() => {
              dialogCloseSubject$.setSubject = true;
            }}
          >
            Cancelar
          </Button>
        </Box>
      </CustomDialog>
    </Box>
  );
}
