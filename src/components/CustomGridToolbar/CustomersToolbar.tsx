import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React from "react";
import { CustomGridToolbar } from "./CustomGridToolbar";

export function CustomersToolbar() {
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <CustomGridToolbar>
      
    </CustomGridToolbar>
  );
}
