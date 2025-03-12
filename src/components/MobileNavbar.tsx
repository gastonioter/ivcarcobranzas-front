import { PrivateRoutes } from "@/models/routes";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SummarizeIcon from "@mui/icons-material/Summarize";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { AppBar, IconButton, Toolbar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const items = [
  { name: "Dashboard", icon: <DashboardIcon />, to: PrivateRoutes.DASHBOARD },
  { name: "Productos", icon: <InventoryIcon />, to: PrivateRoutes.PRODUCTS },
  { name: "Categorias", icon: <CategoryIcon />, to: PrivateRoutes.CATEGORIES },
  { name: "Ventas", icon: <StorefrontIcon />, to: PrivateRoutes.SALES },
  {
    name: "Presupuestos",
    icon: <ReceiptLongIcon />,
    to: PrivateRoutes.BUDGETS,
  },
  { name: "Clientes", icon: <PersonIcon />, to: PrivateRoutes.CUSTOMERS },
  {
    name: "Mensualidades",
    icon: <SummarizeIcon />,
    to: PrivateRoutes.CUOTAS,
  },
  { name: "Pagos", icon: <MonetizationOnIcon />, to: PrivateRoutes.PAYMENTS },
];

export default function MobileNavbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        bottom: "auto",
        display: {
          md: "none",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        {items.map((item, index) => (
          <Tooltip key={index} title={item.name}>
            <IconButton color="inherit" onClick={() => navigate(item.to)}>
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Toolbar>
    </AppBar>
  );
}
