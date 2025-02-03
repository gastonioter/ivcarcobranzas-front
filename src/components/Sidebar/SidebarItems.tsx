import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PersonIcon from "@mui/icons-material/Person";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Box, Divider, List, Typography } from "@mui/material";
import CollapsableItem from "./CollapsableItem";
import InventoryIcon from "@mui/icons-material/Inventory";
import SimpleItem from "./SimpleItem";
import { PrivateRoutes } from "@/models/routes";
import { useLocation } from "react-router";

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
    name: "Recibos",
    to: PrivateRoutes.RECIPTS,
    icon: <RequestQuoteIcon />,
  },
];

export default function SidebarNavigationItems() {
  const location = useLocation();

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <Typography sx={{ textAlign: "center", mt: 3 }} variant="h5" gutterBottom>
        MENU VENTAS/MONITOREO
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
