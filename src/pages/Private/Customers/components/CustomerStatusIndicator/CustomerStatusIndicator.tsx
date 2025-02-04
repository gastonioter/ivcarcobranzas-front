import { CustomerStatus } from "@/models/customer";
import { Circle } from "@mui/icons-material";
import { Box, SvgIcon } from "@mui/material";

interface CustomerStatusIndicatorProps {
  status: CustomerStatus;
}

function CustomerStatusIndicator({ status }: CustomerStatusIndicatorProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <SvgIcon
        component={Circle}
        sx={{
          color: status === CustomerStatus.ACTIVE ? "green" : "red",
        }}
      />
    </Box>
  );
}

export default CustomerStatusIndicator;
