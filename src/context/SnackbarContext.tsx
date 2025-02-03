import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface SnackbarContextType {
  openSnackbar: (message: string, severity?: AlertColor) => void;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

// Proveedor de contexto
export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const openSnackbar = (message: string, severity: AlertColor = "success") => {
    setSnackbarState({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbarState((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
