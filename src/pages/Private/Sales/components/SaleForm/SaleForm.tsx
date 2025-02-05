import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components/CustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserData } from "@/hooks/useUserData";
import { Customer } from "@/models/customer";
import { Product } from "@/models/product";
import {
  CreateSaleFromData,
  createSaleSchema,
  SaleDetailItem,
  SaleDetailsDTO,
} from "@/models/sale";
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

export default function SaleForm({ sale }: { sale?: SaleDetailsDTO }) {
  const [details, setDetails] = useState<SaleDetailItem[]>([]);
  const snackbar = useSnackbar();
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [customer, setCustomer] = useState("");
  const [create, { isLoading, error }] = useCreateSaleMutation();
  const { id } = useUserData();
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
      setDetails(sale.items || []);
      setTax(Number(sale.iva));
    }
  }, [sale]);

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useGetProductsQuery();

  const {
    data: customers,
    isLoading: isLoadingCostumers,
    error: errorCostumers,
  } = useGetCustomersQuery();

  if (error) {
    return <Alert severity="error">Ocurrió un error al crear la venta</Alert>;
  }
  if (errorProducts || errorCostumers) {
    return (
      <Alert severity="error">
        Ocurrió un error al cargar productos o clientes
      </Alert>
    );
  }

  const isDuplicatedProduct = (uuid: string) => {
    return details.some((item) => item.uuid === uuid);
  };

  const addDetailItem = ({ row }: { row: Product }) => {
    const detail: SaleDetailItem = {
      price: row.price,
      product: row.name,
      uuid: row.uuid,
      quantity: 1,
      total: row.price,
    };
    if (!isDuplicatedProduct(row.uuid)) {
      setDetails((prev) => [...prev, detail]);

      snackbar.openSnackbar(`${row.name} agregado a al detalle!`);
    } else {
      snackbar.openSnackbar(
        `El producto ya se encuentra en el detalle!`,
        "info"
      );
    }
  };

  const onDeleteItem = (id: string) => {
    setDetails((prev) => prev.filter((item) => item.uuid !== id));
    snackbar.openSnackbar(`Producto eliminado del detalle!`);
  };

  const handleUpdateDetail = (
    uuid: string,
    price: number,
    quantity: number
  ) => {
    console.log(uuid, price, quantity);
    const updatedDetails = details.map((item) => {
      if (item.uuid === uuid) {
        const updatedTotal = +price * +quantity;
        const updatedItem = {
          ...item,
          price: +price,
          quantity: +quantity,
          total: updatedTotal,
        };
        return updatedItem;
      }
      return item;
    });
    setDetails(updatedDetails);
    snackbar.openSnackbar(`Detalle actualizado!`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const saleData: CreateSaleFromData = {
      seller: id,
      iva: tax,
      customer: customer,
      items: details,
    };

    const result = createSaleSchema.safeParse(saleData);

    if (result.success) {
      try {
        await create(result.data);
      } catch (e) {
        console.error(e);
        snackbar.openSnackbar("Ocurrió un error al crear la venta", "error");
      }

      snackbar.openSnackbar("Venta creada con éxito!");
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
      <Stack spacing={2} direction={"row"}>
        <FormControl sx={{ flex: 1 }}>
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
          label={"IVA"}
          type="number"
          defaultValue={sale?.iva ?? 0}
          disabled={!!sale}
          onBlur={(e) => setTax(parseInt(e.target.value))}
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

      <Stack spacing={2} direction={"column"} alignItems={"flex-start"}>
        <SaleSummary
          subtotal={subtotal}
          tax={tax}
          sx={{ flex: 1, width: 400 }}
        />
        {!sale ? (
          <Button
            sx={{}}
            loading={isLoading}
            variant="contained"
            color="success"
            onClick={onSubmit}
          >
            Crear Venta
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Volver
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
