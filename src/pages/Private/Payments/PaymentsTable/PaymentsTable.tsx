import { Customer, CustomerModalidad } from "@/models";
import { formattedDate } from "@/utilities";
import { formattedCurrency } from "@/utilities/formatPrice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { CustomDialog, dialogOpenSubject$ } from "@/components";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { Payment } from "@/models/Payment";
import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import PaymentDetails from "./PaymentDetails/PaymentDetails";
export default function PaymentsTable({ customer }: { customer: Customer }) {
  const [paymentSelected, setPaymentSelected] = useState<Payment | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const snackbar = useSnackbar();

  if (customer.modalidadData.modalidad !== CustomerModalidad.CLOUD) {
    return <p>El cliente no tiene modalidad de Cloud</p>;
  }

  const sendWpp = async () => {
    try {
      setSending(true);
      await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/prints/monit-recipt/${
          customer.uuid
        }/${id}`,
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
        console.log(value);
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
      width: 100,
      renderCell: ({ row }: { row: Payment }) => (
        <>
          <Tooltip title="Imprimir Recibo">
            <IconButton
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_BASE_API_URL}/prints/monit-recipt/${
                    customer.uuid
                  }/${row.uuid}`
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
        rows={customer.modalidadData.pagos}
        columns={columns}
        getRowId={(row) => row.uuid}
        onRowDoubleClick={showPaymentDetails}
      />

      <CustomDialog>
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
