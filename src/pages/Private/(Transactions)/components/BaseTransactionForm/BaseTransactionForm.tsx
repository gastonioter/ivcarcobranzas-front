import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, Product, Sale, SaleStatus } from "@/models";
import DetailsTable from "@/pages/Private/Sales/components/SaleForm/components/DetailsTable/DetailsTable";
import ProductsForSaleTable from "@/pages/Private/Sales/components/SaleForm/components/ProductsForSaleTable.tsx/ProductsForSaleTable";
import SaleSummary from "@/pages/Private/Sales/components/SaleForm/components/SaleSummary/SaleSummary";
import { useGetCustomersQuery } from "@/services/customerApi";
import { useGetProductsQuery } from "@/services/productApi";
import { AddCircleRounded } from "@mui/icons-material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
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
import { useLocation, useNavigate } from "react-router";

import { Detail } from "@/models/Transaction";
import { useTransactionContext } from "../../context/TransactionContext";
import { NewTransactionsStyled } from "../../styled-components/new.styled.component";

export interface IBaseTransactionFormProps {
  sale?: Sale;
  children?: React.ReactNode;
  onSumbit: () => void;
}

export default function BaseTransactionForm({
  sale,
  children,
  onSumbit,
}: IBaseTransactionFormProps) {
  const navigate = useNavigate();

  const location = useLocation();
  const snackbar = useSnackbar();

  const { transaction, dispatch } = useTransactionContext();
  const { details, iva, subtotal } = transaction;

  const page = location.pathname.split("/")[2];
  const entity = page.includes("ventas") ? "venta" : "presupuesto";
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

  const isDuplicatedProduct = (uuid: string) => {
    return details.some((item) => item.uuid === uuid);
  };

  if (errorProducts || errorCostumers) {
    return (
      <Alert severity="error">
        Ocurrió un error al cargar productos o clientes
      </Alert>
    );
  }

  const onUpdateDetail = (row: Detail) => {
    dispatch({
      type: "update-item",
      payload: row,
    });
    snackbar.openSnackbar("Producto actualizado!", "success");
  };

  const onDeleteDetail = (uuid: string) => {
    dispatch({
      type: "delete-item",
      payload: uuid,
    });
  };

  const onAddDetail = ({ row }: { row: Product }) => {
    if (isDuplicatedProduct(row.uuid)) {
      snackbar.openSnackbar("El producto ya ha sido agregado!", "info");
    } else {
      dispatch({
        type: "add-item",
        payload: row,
      });

      snackbar.openSnackbar("Producto agregado!", "success");
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const { type, data } = onSumbit();
  //   const result = CreateTransactionSchema.safeParse({
  //     sellerId: userId,
  //     iva: tax,
  //     customerId: customer,
  //     details,
  //   });

  //   if (!result.success) {
  //     snackbar.openSnackbar(result.error.issues[0].message, "error");
  //     return;
  //   }

  //   if (type == "sale") {
  //     try {
  //       await createSale(result.data).unwrap();
  //       snackbar.openSnackbar(`Venta creada con exito!`);
  //       navigate(-1);
  //     } catch (e) {
  //       console.error(e);
  //       snackbar.openSnackbar(e.data.error, "error");
  //     }
  //   }
  //   if (type == "budget") {
  //     console.log(data.expiresAt?.toDate());
  //     try {
  //       await createBudget({
  //         ...result.data,
  //         ...(data.expiresAt ? { expiresAt: data.expiresAt.toDate() } : {}),
  //       }).unwrap();
  //       snackbar.openSnackbar(`Presupuesto creado con exito!`);
  //       navigate(-1);
  //     } catch (e) {
  //       console.error(e);
  //       snackbar.openSnackbar(e.data.error, "error");
  //     }
  //   }
  // };

  return (
    <>
      <NewTransactionsStyled>
        <FormControl>
          <Autocomplete
            onChange={(event, value) => {
              dispatch({
                type: "update-customer",
                payload: value.uuid,
              });
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
          onChange={(e) => {
            const tax: number = !Number.isNaN(parseFloat(e.target.value))
              ? parseInt(e.target.value)
              : 0;
            dispatch({
              type: "update-iva",
              payload: tax,
            });
          }}
        ></TextField>

        <Button
          endIcon={<AddCircleRounded />}
          sx={{ gridColumnEnd: 3, gridColumnStart: 1, width: "fit-content" }}
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
          onDeleteItem={onDeleteDetail}
          handleUpdateDetail={onUpdateDetail}
        />

        <SaleSummary
          forBudget={entity === "presupuesto"}
          subtotal={subtotal}
          tax={iva}
          sx={{ flex: 1 }}
          isCancelled={sale?.status === SaleStatus.CANCELLED}
        />

        {children}

        <Stack
          sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
          direction="row"
          gap={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Button
            endIcon={<RocketLaunchIcon />}
            loading={false}
            variant="contained"
            color="success"
            onClick={onSumbit}
          >
            Crear {entity}
          </Button>

          <Button
            loading={false}
            variant="outlined"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancelar
          </Button>
        </Stack>
      </NewTransactionsStyled>

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
            onClickRow={onAddDetail}
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
    </>
  );
}
