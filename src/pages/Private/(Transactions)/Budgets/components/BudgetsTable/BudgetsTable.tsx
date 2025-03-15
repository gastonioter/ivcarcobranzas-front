import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import TableMenuActions from "@/components/TableMenuActions/TableMenuActions";
import { useSnackbar } from "@/context/SnackbarContext";
import { Customer, PrivateRoutes } from "@/models";
import { Budget, BudgetStatus } from "@/models/Budget";
import {
  useGetBudgetsQuery,
  useUpdateBudgetStatusMutation,
} from "@/services/budgetApi";
import { formattedDate } from "@/utilities";
import { formatFullName } from "@/utilities/formatFullName";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Chip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function BudgetsTable() {
  const { data, isLoading } = useGetBudgetsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBudgetStatusMutation();
  //const [toggleStatus] = useUpdateSaleStatusMutation();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [rowId, setRowId] = useState<string | null>(null);
  const [operation, setOperation] = useState<"reject" | "approve" | null>(null);
  const changeStatusCreator =
    (status: BudgetStatus) => async (uuid: string) => {
      try {
        await updateStatus({ uuid, status }).unwrap();
      } catch (e) {
        snackbar.openSnackbar(e.data.error, "error");
        console.log(e);
      }
    };

  const rows = data || [];

  const newTabRef = useRef<Window | null>(null);

  const openNewTab = (path: string) => {
    const baseURL = `${import.meta.env.VITE_BASE_API_URL}`;
    newTabRef.current = window.open(baseURL + path, "_blank");
  };

  const approveBudget = async (uuid: string | null) => {
    if (!uuid) return;

    try {
      await changeStatusCreator(BudgetStatus.APPROVED)(uuid);
    } catch (e) {
      snackbar.openSnackbar(e.data.error, "error");
      console.log(e);
    }
  };

  const rejectBudget = async (uuid: string | null) => {
    if (!uuid) return;

    try {
      await changeStatusCreator(BudgetStatus.REJECTED)(uuid);
    } catch (e) {
      snackbar.openSnackbar(e.data.error, "error");
      console.log(e);
    }
  };

  const actions = ({ row: budget }: { row: Budget }) => (
    <TableMenuActions
      actions={[
        {
          name: "Ver Detalle",
          onClick: () => {
            navigate(
              `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.BUDGETS}/${budget.uuid}`
            );
          },
        },
        {
          name: `Aprobar`,
          onClick() {
            setRowId(budget.uuid);
            setOperation("approve");
          },
          isDisabled:
            budget.status === BudgetStatus.REJECTED ||
            budget.status === BudgetStatus.APPROVED,
        },
        {
          name: `Rechazar`,
          onClick() {
            setRowId(budget.uuid);
            setOperation("reject");
          },
          isDisabled:
            budget.status === BudgetStatus.REJECTED ||
            budget.status === BudgetStatus.APPROVED,
        },
        {
          name: "Imprimir",
          onClick: () => {
            openNewTab(`/prints/budget/${budget.uuid}`);
          },
          isDisabled: budget.status === BudgetStatus.REJECTED,
        },
      ]}
    />
  );
  const columns: GridColDef<Budget>[] = [
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
      valueGetter: (seller: { email: string }) => `${seller.email}`,
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
      renderCell: ({ row }: { row: Budget }) => (
        <Chip
          color={
            row.status === BudgetStatus.PENDING
              ? "info"
              : row.status === BudgetStatus.REJECTED
              ? "error"
              : "success"
          }
          sx={{ textTransform: "capitalize" }}
          label={row.status}
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

      <ConfirmationDialog
        close={() => setRowId(null)}
        loading={isUpdating}
        onConfirm={async () => {
          if (operation === "approve") {
            await approveBudget(rowId);
          } else if (operation === "reject") {
            await rejectBudget(rowId);
          }
        }}
        open={!!rowId}
      >
        {operation == "approve" ? (
          <>
            Al aprobar este presupuesto se creará automaticamente una nueva
            venta en estado<strong>"PENDIENTE DE PAGO"</strong> y ya no podras
            hacer nada con el presupuesto, ¿Deseas continuar?
          </>
        ) : (
          <>
            Rechazar un presupuesto es una operacion{" "}
            <strong>IRREVERSIBLE</strong> y ya no podras hacer mas nada con el
            mismo, ¿Deseas continuar?
          </>
        )}
      </ConfirmationDialog>
    </>
  );
}
