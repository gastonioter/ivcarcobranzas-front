import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import SimpleItem, { SimpleItemProps } from "./SimpleItem";

interface CollapsableItemProps {
  items: SimpleItemProps[];
  name: string;
  icon: JSX.Element;
}

export default function CollapsableItem({
  icon,
  name,
  items,
}: CollapsableItemProps) {
  const [open, setOpen] = useState(false);
  console.log(items);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <SimpleItem
              selected={location.pathname.includes(item.to)}
              isNested
              key={item.name}
              name={item.name}
              to={item.to}
              icon={item.icon}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}
