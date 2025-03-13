import { CustomGridToolbar } from "@/components";
import { SalePayment, SalePaymentStatus } from "@/models/SalePayment";
import { useGetSalePaymentsQuery } from "@/services/saleApi";
import { formattedDate } from "@/utilities";
import { formattedCurrency } from "@/utilities/formatPrice";
import PrintIcon from "@mui/icons-material/Print";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "react-router";
import ToggleStatusButton from "./components/ToggleStatusButton";
export default function SalePaymentsTable() {
  const { uuid: saleID } = useParams();
  const { data: payments, isLoading } = useGetSalePaymentsQuery(
    saleID as string
  );

  const rows = (payments || []).map((payment, index) => ({
    ...payment,
    nro: index + 1,
  }));

  const columns: GridColDef<SalePayment>[] = [
    { field: "nro", headerName: "#", width: 50 },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 0.5,
      valueFormatter: (value) => formattedDate(value),
    },
    {
      field: "amount",
      headerName: "Monto",
      flex: 1,
      valueFormatter: (value) => `${formattedCurrency(value)}`,
    },
    { field: "paymentMethod", headerName: "Metodo", flex: 1 },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ row }: { row: SalePayment }) => (
        <Chip
          label={`${row.status}`}
          size="small"
          color={`${
            row.status === SalePaymentStatus.ACTIVE ? "success" : "error"
          }`}
        />
      ),
    },
    {
      field: "action",
      headerName: "Acciones",
      width: 100,
      renderCell: ({ row }) => (
        <>
          <ToggleStatusButton
            row={row}
            saleId={saleID || ""}
            status={row.status}
          />
          <IconButton
            disabled={row.status === SalePaymentStatus.CANCELLED}
            onClick={() => {
              window.open(
                `${import.meta.env.VITE_BASE_API_URL}/prints/recipt/${saleID}/${
                  row.uuid
                }`
              );
            }}
          >
            <PrintIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      slots={{
        toolbar: CustomGridToolbar,
      }}
      disableRowSelectionOnClick
      loading={isLoading}
      isRowSelectable={({ row }) => !row.isCupon}
      sx={{ flexBasis: 100, flex: 2, maxWidth: "100%" }}
      getRowId={(row) => row.uuid}
    />
  );
}
