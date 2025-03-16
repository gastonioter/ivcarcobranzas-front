import { useSnackbar } from "@/context/SnackbarContext";
import { useState } from "react";

export const useSendRsmMontiWpp = (id: string) => {
  const snackbar = useSnackbar();
  const [sending, setSending] = useState(false);

  const sendWpp = async () => {
    try {
      setSending(true);
      if (id) {
        await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/prints/rsmmonit/${id}`,
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
      }
    } catch (e) {
      console.log(e);
      snackbar.openSnackbar(`${e.data.error}`, "error");
    } finally {
      setSending(false);
    }
  };

  return { sendWpp, sending };
};
