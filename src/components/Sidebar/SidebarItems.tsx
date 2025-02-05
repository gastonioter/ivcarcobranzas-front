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
    name: "Clientes",
    icon: <PersonIcon />,
    to: PrivateRoutes.CUSTOMERS,
  },
  {
    name: "Mensualidades",
    to: PrivateRoutes.MONTHLY_FEES,
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
        sx={{ textAlign: "center", mt: 3, p: 8 }}
        variant="h6"
        gutterBottom
      >
        Navegacion
      </Typography>
      <Divider sx={{ mt: 0 }} />
      <List>
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
