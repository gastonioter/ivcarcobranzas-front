import { Customer, CustomerModalidad } from "@/models";
import { formattedDate } from "@/utilities";
import { formattedCurrency } from "@/utilities/formatPrice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { Payment } from "@/models/Payment";
import { CustomDialog, dialogOpenSubject$ } from "@/components";
import { useState } from "react";
import PaymentDetails from "./PaymentDetails/PaymentDetails";
export default function PaymentsTable({ customer }: { customer: Customer }) {
  const [paymentSelected, setPaymentSelected] = useState<Payment | null>(null);

  if (customer.modalidadData.modalidad !== CustomerModalidad.CLOUD) {
    return <p>El cliente no tiene modalidad de Cloud</p>;
  }

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
      renderCell: ({row}) => (
        <>
          <Tooltip title="Imprimir Recibo">
            <IconButton
              onClick={() => {
                window.open(
                  `http://localhost:3001/api/prints/monit-recipt/${customer.uuid}/${row.uuid}`
                );
              }}
            >
              <PrintIcon />
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
    </>
  );
}
