import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router";

export interface SimpleItemProps {
  icon: JSX.Element;
  name: string;
  isNested?: boolean;
  to: string;
  selected: boolean;
}

export default function SimpleItem({
  icon,
  name,
  to,
  isNested,
  selected,
}: SimpleItemProps) {
  const navigate = useNavigate();

  // const closeSidebar = () => {
  //   dialogCloseSubject$.setSubject = true;
  // };

  return (
    <ListItem
      disablePadding
      // onClick={closeSidebar}
      sx={{ pl: isNested ? 4 : 0 }}
    >
      <ListItemButton selected={selected} onClick={() => navigate(to)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}
