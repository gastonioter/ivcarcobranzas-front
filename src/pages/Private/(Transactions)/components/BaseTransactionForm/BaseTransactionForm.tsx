import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components";
import { useSnackbar } from "@/context/SnackbarContext";
import { Product, SaleStatus } from "@/models";
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
import { SaleCustomer } from "../../context/reducer";
import { useDispatch, useTransaction } from "../../hooks";
import { NewTransactionsStyled } from "../../styled-components/new.styled.component";
import { useEffect } from "react";

export interface IBaseTransactionFormProps {
  children?: React.ReactNode;
  onSumbit: () => void;
}

export default function BaseTransactionForm({
  children,
  onSumbit,
}: IBaseTransactionFormProps) {
  const navigate = useNavigate();

  const location = useLocation();
  const snackbar = useSnackbar();

  const { details, iva, subtotal, customer, editMode, saleStatus } =
    useTransaction();
  const dispatch = useDispatch();

  const page = location.pathname.split("/")[2];
  const entity = page.includes("ventas") ? "venta" : "presupuesto";

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useGetProductsQuery();

  useEffect(() => {
    console.log("Customer en Autocomplete:", customer);
  }, [customer]);

  const {
    data,
    isLoading: isLoadingCostumers,
    error: errorCostumers,
  } = useGetCustomersQuery();

  const customers = data as SaleCustomer[];

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

  return (
    <>
      <NewTransactionsStyled>
        {/* TRANSACTION FORM INPUTS */}
        <FormControl>
          <Autocomplete
            onChange={(event, customer) => {
              dispatch({
                type: "update-customer",
                payload: customer,
              });
            }}
            disableClearable
            value={customer}
            readOnly={!!editMode}
            getOptionLabel={(option: SaleCustomer) =>
              `${option.firstName} ${option.lastName}`
            }
            disabled={isLoadingCostumers || editMode}
            options={customers ?? []}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
        </FormControl>

        <TextField
          label={"IVA"}
          value={iva}
          disabled={!!editMode}
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
          disabled={isLoadingProducts || !!editMode}
        >
          Agregar Productos
        </Button>

        <DetailsTable
          readOnly={!!editMode}
          details={details}
          onDeleteItem={onDeleteDetail}
          handleUpdateDetail={onUpdateDetail}
        />

        <SaleSummary
          forBudget={entity === "presupuesto"}
          subtotal={subtotal}
          tax={iva}
          sx={{ flex: 1 }}
          isCancelled={saleStatus === SaleStatus.CANCELLED}
        />

        {/* EXTRA FORM INPUTS */}

        {children}

        {/* FOOTER BUTTONS */}
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
            disabled={!!editMode}
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
