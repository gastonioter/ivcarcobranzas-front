import { CustomDialog, dialogOpenSubject$ } from "@/components";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { Payment } from "@/models/Payment";
import { formattedDate } from "@/utilities";
import { formattedCurrency } from "@/utilities/formatPrice";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import PaymentDetails from "./PaymentDetails/PaymentDetails";
import { useSearchParams } from "react-router-dom";

export default function PaymentsTable({ recibos }: { recibos: Payment[] }) {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

  const [paymentSelected, setPaymentSelected] = useState<Payment | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const snackbar = useSnackbar();

  const sendWpp = async () => {
    try {
      setSending(true);
      await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }/prints/monit-recipt/${customerId}/${id}`,
        {
          body: JSON.stringify({
            sendMethod: "WPP",
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      snackbar.openSnackbar("Whatsapp enviado con éxito");
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(`${e.data.error}`, "error");
    } finally {
      setSending(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "serie",
      headerName: "Serie",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1,
      valueFormatter: (value) => {
        return formattedDate(value);
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      valueFormatter: (value) => formattedCurrency(value),
    },
    {
      field: "cant_cuotas",
      headerName: "# Cuotas",
      renderCell: (params) => params.row.cuotas.length,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: ({ row }: { row: Payment }) => (
        <>
          <Tooltip title="Imprimir Recibo">
            <IconButton
              onClick={() => {
                window.open(
                  `${
                    import.meta.env.VITE_BASE_API_URL
                  }/prints/monit-recipt/${customerId}/${row.uuid}`
                );
              }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Enviar Recibo">
            <IconButton
              onClick={() => {
                setId(row.uuid);
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ver Detalle">
            <IconButton
              onClick={() => {
                setPaymentSelected(row);
                dialogOpenSubject$.setSubject = true;
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const showPaymentDetails = ({ row }: { row: Payment }) => {
    setPaymentSelected(row);
    dialogOpenSubject$.setSubject = true;
  };

  return (
    <>
      <DataGrid
        rows={recibos}
        columns={columns}
        getRowId={(row) => row.uuid}
        onRowDoubleClick={showPaymentDetails}
      />

      <CustomDialog
        title="Detalle del Recibo"
        sx={{ p: 5, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <PaymentDetails payment={paymentSelected} />
      </CustomDialog>

      <ConfirmationDialog
        open={!!id}
        loading={sending}
        onConfirm={sendWpp}
        close={() => setId(null)}
      >
        <>
          Estas a punto de <strong>enviar el recibo</strong> al numero de
          WhatsApp del cliente, ¿Estás seguro de continuar?
        </>
      </ConfirmationDialog>
    </>
  );
}
