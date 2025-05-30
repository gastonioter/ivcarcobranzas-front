import { Cuota, CuotaStatus } from "@/models/Cuota";
import {
  useGetCuotasQuery,
  useUpdateCuotaMutation,
  useUpdateCuotasMutation,
} from "@/services/cuotasApi";
import SummarizeIcon from "@mui/icons-material/Summarize";

import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Box, Button, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router";
import CuotasFilters from "../CuotasFilters/CuotasFilters";
import ToggleStatusButton from "./ToggleStatusButton/ToggleStatusButton";
import { useCuotasURLFilters } from "./hooks/useCuotasURLFilters";
export interface ICuotasTableProps {
  customerId: string;
}

export default function CuotasTable({ customerId }: ICuotasTableProps) {
  const { filters } = useCuotasURLFilters();

  const navigate = useNavigate();
  const { data: cuotas } = useGetCuotasQuery(customerId);
  const [cuotasIdToPay, setCuotasIdToPay] = useState<readonly GridRowId[]>([]);
  const [update] = useUpdateCuotaMutation();
  const [open, setOpen] = useState(false);
  const [payCuotas, { isLoading }] = useUpdateCuotasMutation();
  const snackbar = useSnackbar();

  const cuotasSinPagar =
    cuotas
      ?.filter(
        (cuota) =>
          cuota.status != CuotaStatus.PAID &&
          cuota.status != CuotaStatus.NO_SERVICE
      )
      .map((cuota) => cuota.uuid) ?? [];

  const updateCuotaSerie = async (cuota: Cuota) => {
    try {
      await update({
        cuotaId: cuota.uuid,
        customerId,
        serie: cuota.serie,
        status: cuota.status,
        monto: cuota.amount,
      });
      snackbar.openSnackbar("Cuota actualizada");
    } catch {
      snackbar.openSnackbar("Error al actualizar la cuota", "error");
    }
  };

  const cuotasFiltered = cuotas?.filter((cuota) => {
    const coincideMes = !filters.month || String(cuota.month) === filters.month;
    const coincideAnio = !filters.year || String(cuota.year) === filters.year;
    const coincideEstado = !filters.status || cuota.status === filters.status;

    return coincideMes && coincideAnio && coincideEstado;
  });

  console.log("cuotasFiltered", cuotas);
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
                : // : row.status === CuotaStatus.LATE
                  // ? "warning"
                  "error"
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
        return (
          <ToggleStatusButton
            customerId={customerId}
            row={row}
            status={row.status}
          />
        );
      },
    },
  ];

  const handlePayments = async () => {
    try {
      await payCuotas({
        cuotasId: cuotasIdToPay as string[],
        customerId,
        status: CuotaStatus.PAID,
      }).unwrap();
      navigate(`/private/pagos?customerId=${customerId}&animateNew=yes`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        {cuotas && cuotas.length >= 0 && (
          <Box sx={{ flex: 1 }}>
            <CuotasFilters />
          </Box>
        )}
        {cuotasIdToPay.length > 0 && (
          <Box sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}>
            <div>
              <Button
                endIcon={<SummarizeIcon />}
                variant="contained"
                size="small"
                color="success"
                onClick={() => setOpen(true)}
              >
                Generar Recibo de Pago
              </Button>
            </div>
          </Box>
        )}
      </Box>
      <DataGrid
        editMode="cell"
        columns={columns}
        checkboxSelection
        isRowSelectable={(params) =>
          cuotasSinPagar?.includes(params.id.toString())
        }
        rows={cuotasFiltered}
        hideFooterSelectedRowCount
        rowSelectionModel={cuotasIdToPay}
        onRowSelectionModelChange={(newSelection) => {
          setCuotasIdToPay(newSelection);
        }}
        processRowUpdate={(row) => {
          updateCuotaSerie(row);
        }}
        getRowId={(row) => row.uuid}
      ></DataGrid>

      <ConfirmationDialog
        loading={isLoading}
        onConfirm={handlePayments}
        open={open}
        close={() => setOpen(false)}
      >
        <>
          Al confirmar vas a generar un <strong>recibo de pago</strong> al
          cliente con las cuotas que seleccionaste:{" "}
          <strong>
            {cuotasIdToPay
              .map((id) => cuotas?.find((cuota) => cuota.uuid == id))
              .map((cuota) => `${cuota?.year}/${cuota?.month}`)
              .join(" - ")}
          </strong>
          {` ¿Estás seguro de continuar?`}
        </>
      </ConfirmationDialog>
    </>
  );
}
