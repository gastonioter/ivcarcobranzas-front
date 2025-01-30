import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router";
import { dialogCloseSubject$ } from "./Sidebar";

export interface SimpleItemProps {
  icon: JSX.Element;
  name: string;
  isNested?: boolean;
  to: string;
}

export default function SimpleItem({
  icon,
  name,
  to,
  isNested,
}: SimpleItemProps) {
  const navigate = useNavigate();
  const closeSidebar = () => {
    dialogCloseSubject$.setSubject = false;
  };
  return (
    <ListItem
      disablePadding
      onClick={closeSidebar}
      sx={{ pl: isNested ? 4 : 0 }}
    >
      <ListItemButton onClick={() => navigate(to)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}
