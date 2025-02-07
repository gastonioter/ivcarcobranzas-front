import { dialogOpenSubject$ } from "@/components";
import ConfirmationDialog, {
  IConfirmationDialogProps,
} from "@/components/ConfirmationDialog/ConfirmationDialog";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  BudgetStatus,
  Customer,
  PrivateRoutes,
  SaleItemTable,
  Transaction,
  TransactionType,
} from "@/models";
import {
  useGetSalesQuery,
  useUpdateSaleStatusMutation,
} from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Chip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function BudgetsTable() {
  const { data, isLoading } = useGetSalesQuery();
  const [toggleStatus] = useUpdateSaleStatusMutation();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [confirmatoinState, setConfirmatoinState] =
    useState<IConfirmationDialogProps>({
      message: <></>,
      onConfirm: () => {},
    });

  const rows: GridRowsProp = (data || []).filter(
    (transaction) => transaction.status.type === TransactionType.BUDGET
  );

  const actions = ({ row: budget }: { row: Transaction }) => (
    <TableMenuActions
      actions={[
        {
          name: "Ver Detalle",
          onClick: () => {
            navigate(
              `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALES}/${budget.uuid}`
            );
          },
          isDisabled: budget.status.status === BudgetStatus.REJECTED,
        },
        {
          name: `Aprobar`,
          onClick() {
            setConfirmatoinState({
              message: (
                <div>
                  Al aprobar este presupuesto pasara automaticamente al listado
                  de ventas con estado <strong>"PENDIENTE DE PAGO"</strong>,
                  ¿Deseas continuar?
                </div>
              ),
              onConfirm: async () => {
                try {
                  await toggleStatus({
                    uuid: budget.uuid,
                    status: BudgetStatus.APPROVED,
                  }).unwrap();
                } catch (e) {
                  snackbar.openSnackbar(e.data.error, "error");
                  console.log(e);
                }
              },
            });

            dialogOpenSubject$.setSubject = true;
          },
          isDisabled: budget.status.status === BudgetStatus.REJECTED,
        },
        {
          name: `Rechazar`,
          onClick() {
            setConfirmatoinState({
              isDanger: true,
              message: (
                <div>
                  Estas a punto de rechazar un presupuesto lo cual es una
                  operacion <strong>IRREVERSIBLE</strong>, ¿Estas seguro de
                  continuar?
                </div>
              ),
              onConfirm: async () => {
                try {
                  await toggleStatus({
                    uuid: budget.uuid,
                    status: BudgetStatus.REJECTED,
                  }).unwrap();
                } catch (e) {
                  snackbar.openSnackbar(e.data.error, "error");
                  console.log(e);
                }
              },
            });

            dialogOpenSubject$.setSubject = true;
          },
          isDisabled: budget.status.status === BudgetStatus.REJECTED,
        },
        {
          name: "Imprimir",
          onClick: () => {},
          isDisabled: budget.status.status === BudgetStatus.REJECTED,
        },
      ]}
    />
  );
  const columns: GridColDef[] = [
    { field: "serie", headerName: "Serie", flex: 1 },
    {
      field: "createdAt",
      headerName: "Fecha",
      filterable: false,
      flex: 1,
      valueFormatter: (value: string) => formattedDate(value),
    },
    {
      field: "customer",
      headerName: "Cliente",
      flex: 1,
      valueGetter: (customer: Customer) =>
        formatFullName(customer.firstName, customer.lastName),
    },
    {
      field: "seller",
      headerName: "Creador",
      flex: 1,
      filterable: false,
      sortable: false,
      valueGetter: (seller) => `${seller.email}`,
    },
    {
      field: "totalAmount",
      headerName: "Total",
      flex: 0.5,
      valueFormatter: (value: string) => formattedCurrency(value),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }: { row: SaleItemTable }) => (
        <Chip
          color={
            row.status.status === BudgetStatus.PENDING_APPROVAL
              ? "info"
              : row.status.status === BudgetStatus.REJECTED
              ? "error"
              : "success"
          }
          sx={{ textTransform: "capitalize" }}
          label={row.status.status}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: actions,
    },
  ];

  return (
    <>
      <DataGrid
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        rows={rows}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.uuid}
        disableDensitySelector
        disableRowSelectionOnClick
        disableColumnMenu
      />

      <ConfirmationDialog {...confirmatoinState} />
    </>
  );
}
