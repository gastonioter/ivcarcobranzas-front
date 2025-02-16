import {
  CustomDialog,
  dialogCloseSubject$,
  dialogOpenSubject$,
} from "@/components";
import { useSnackbar } from "@/context/SnackbarContext";
import { Product } from "@/models";
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
import { useSummary, useSummaryDispatch } from "../../hooks/summary";
import { useDispatch, useTransaction } from "../../hooks/transaction";
import { SaleCustomer } from "../../reducers/transactionReducer";
import { NewTransactionsStyled } from "../../styled-components/new.styled.component";
import DetailsTable from "./components/DetailsTable/DetailsTable";
import ProductsForSaleTable from "./components/ProductsForSaleTable/ProductsForSaleTable";
import SaleSummary from "./components/SaleSummary/SaleSummary";

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

  const { details, customer, readonly } = useTransaction();
  const dispatch = useDispatch();

  const summaryDispatch = useSummaryDispatch();
  const { iva } = useSummary();

  const page = location.pathname.split("/")[2];
  const entity = page.includes("ventas") ? "venta" : "presupuesto";

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useGetProductsQuery();

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
    console.log("PRODUCT SELECTED", row);
    if (isDuplicatedProduct(row.uuid)) {
      snackbar.openSnackbar("El producto ya ha sido agregado!", "info");
    } else {
      dispatch({
        type: "add-item",
        payload: {
          ...row,
          price: Number(row.price),
        },
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
            getOptionLabel={(option: SaleCustomer) =>
              `${option.firstName} ${option.lastName}`
            }
            disabled={isLoadingCostumers || readonly}
            options={customers ?? []}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
        </FormControl>

        <TextField
          label={"IVA"}
          value={iva}
          disabled={readonly}
          onChange={(e) => {
            const tax: number = !Number.isNaN(parseFloat(e.target.value))
              ? parseInt(e.target.value)
              : 0;
            summaryDispatch({
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
          disabled={isLoadingProducts || readonly}
        >
          Agregar Productos
        </Button>

        <DetailsTable
          readOnly={readonly}
          details={details}
          onDeleteItem={onDeleteDetail}
          handleUpdateDetail={onUpdateDetail}
        />

        <SaleSummary forBudget={entity === "presupuesto"} sx={{ flex: 1 }} />

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
            disabled={readonly}
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
