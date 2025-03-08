import { PrivateRoutes } from "@/models/routes";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Box, Divider, List, Typography } from "@mui/material";
import { useLocation } from "react-router";
import CollapsableItem from "./CollapsableItem";
import SimpleItem from "./SimpleItem";
import logo from "../../assets/logo.png";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
const items = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    to: PrivateRoutes.DASHBOARD,
  },

  {
    name: "Catalogo",
    icon: <LocalGroceryStoreIcon />,

    items: [
      {
        name: "Productos",
        to: PrivateRoutes.PRODUCTS,
        icon: <InventoryIcon />,
      },
      {
        name: "Categorias",
        to: PrivateRoutes.CATEGORIES,
        icon: <CategoryIcon />,
      },
    ],
  },
  {
    name: "Ventas",
    to: PrivateRoutes.SALES,
    icon: <StorefrontIcon />,
  },
  {
    name: "Presupuestos",
    to: PrivateRoutes.BUDGETS,
    icon: <ReceiptLongIcon />,
  },
  {
    name: "Clientes",
    icon: <PersonIcon />,
    to: PrivateRoutes.CUSTOMERS,
  },
  {
    name: "Cuotas",
    to: PrivateRoutes.CUOTAS,
    icon: <SummarizeIcon />,
  },
  {
    name: "Pagos",
    to: PrivateRoutes.PAYMENTS,
    icon: <MonetizationOnIcon />,
  },
];

export default function SidebarNavigationItems() {
  const location = useLocation();

  return (
    <Box role="presentation">
      <Typography
        sx={{ textAlign: "center", m: 4, p: 0.4 }}
        variant="h6"
        gutterBottom
      >
        <img src={logo} alt="" />
      </Typography>
      <Divider sx={{ mt: -6.5 }} />
      <List sx={{ mt: 0 }}>
        {items.map((navItem) =>
          navItem.to ? (
            <SimpleItem
              icon={navItem.icon}
              name={navItem.name}
              to={navItem.to}
              key={navItem.name}
              selected={location.pathname.includes(navItem.to)}
            />
          ) : (
            <CollapsableItem
              icon={navItem.icon}
              name={navItem.name}
              items={navItem.items}
              key={navItem.name}
            />
          )
        )}
      </List>
      <Divider />
    </Box>
  );
}
