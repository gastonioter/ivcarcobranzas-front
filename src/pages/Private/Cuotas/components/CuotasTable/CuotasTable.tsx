import { Cuota, CuotaStatus } from "@/models/Cuota";
import {
  useGetCuotasQuery,
  useUpdateCuotaMutation,
} from "@/services/cuotasApi";
import SummarizeIcon from "@mui/icons-material/Summarize";

import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { usePayCuotasMutation } from "@/services/paymentCuotasApi";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Box, Button, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router";
import CuotasFilters from "../CuotasFilters/CuotasFilters";
import ToggleStatusButton from "./ToggleStatusButton/ToggleStatusButton";
import { useCuotasURLFilters } from "./hooks/useCuotasURLFilters";
export default function CuotasTable() {
  const { filters } = useCuotasURLFilters();
  const navigate = useNavigate();

  const { data: cuotas, isLoading } = useGetCuotasQuery(filters);

  const [cuotasIdToPay, setCuotasIdToPay] = useState<readonly GridRowId[]>([]);
  const [update] = useUpdateCuotaMutation();
  const [open, setOpen] = useState(false);
  const [payCuotas, { isLoading: isPaying }] = usePayCuotasMutation();
  const snackbar = useSnackbar();

  const updateCuota = async (cuota: Cuota) => {
    try {
      await update({
        cuotaId: cuota.uuid,
        amount: cuota.amount,
      }).unwrap();
      snackbar.openSnackbar("Cuota actualizada");
    } catch (err: any) {
      snackbar.openSnackbar(
        err?.data?.error || "Error al actualizar la cuota",
        "error",
      );
    }
  };

  const columns: GridColDef[] = [
    {
      field: "serie",
      headerName: "Serie",
      flex: 1,
      editable: true,
    },
    {
      field: "fecha",
      headerName: "Fecha (MES/AÑO)",
      sortable: false,
      renderCell(params) {
        return `${params.row.month}/${params.row.year}`;
      },
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Monto",
      sortable: false,
      valueFormatter: (value) => formattedCurrency(value),
      flex: 1,
      editable: true,
    },
    {
      field: "status",
      headerName: "Estado",
      sortable: false,
      flex: 1,
      renderCell({ row }: { row: Cuota }) {
        return (
          <Chip
            color={
              row.status === CuotaStatus.PAID
                ? "success"
                : row.status === CuotaStatus.PENDING
                  ? "info"
                  : "error"
            }
            sx={{ textTransform: "capitalize" }}
            label={row.status}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: ({ row }) => {
        return <ToggleStatusButton row={row} status={row.status} />;
      },
    },
  ];

  const handlePayments = async () => {
    try {
      await payCuotas({
        cuotaIds: cuotasIdToPay as string[],
        customerId: filters.customerId as string,
      }).unwrap();
      navigate(
        `/private/pagos?customerId=${filters.customerId}&animateNew=yes`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ mb: 2 }}>
        {cuotas && (
          <Box sx={{ flex: 1 }}>
            <CuotasFilters />
          </Box>
        )}
        {cuotasIdToPay.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              endIcon={<SummarizeIcon />}
              variant="contained"
              size="small"
              color="success"
              onClick={() => setOpen(true)}
            >
              Generar Recibo de Pago
            </Button>
          </Box>
        )}
      </Box>

      <DataGrid
        editMode="cell"
        columns={columns}
        checkboxSelection
        isRowSelectable={({ row }: { row: Cuota }) =>
          row.status !== CuotaStatus.PAID
        }
        rows={cuotas ?? []} // <-- Pasamos directamente las cuotas que vienen de la API
        loading={isLoading} // <-- Pasamos el estado de carga al DataGrid
        hideFooterSelectedRowCount
        rowSelectionModel={cuotasIdToPay}
        onRowSelectionModelChange={(newSelection) => {
          setCuotasIdToPay(newSelection);
        }}
        processRowUpdate={(row) => {
          updateCuota(row);
          return row;
        }}
        getRowId={(row) => row.uuid}
      />

      <ConfirmationDialog
        loading={isPaying}
        onConfirm={handlePayments}
        open={open}
        close={() => setOpen(false)}
      >
        <>
          Al confirmar vas a generar un <strong>recibo de pago</strong> al
          cliente con las cuotas que seleccionaste:{" "}
          <strong>
            {cuotasIdToPay
              .map((id) => cuotas?.find((cuota) => cuota.uuid === id))
              .map((cuota) => `${cuota?.year}/${cuota?.month}`)
              .join(" - ")}
          </strong>
          {` ¿Estás seguro de continuar?`}
        </>
      </ConfirmationDialog>
    </>
  );
}
