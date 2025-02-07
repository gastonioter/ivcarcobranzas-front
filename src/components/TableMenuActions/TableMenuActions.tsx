import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";

type Action = {
  name: string;
  onClick: () => void;
  isDisabled?: boolean;
};

type TableMenuActionsProps = {
  actions: Action[];
};

export default function TableMenuActions({ actions }: TableMenuActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {actions.map((action) => (
          <MenuItem
            disabled={action.isDisabled}
            key={action.name}
            onClick={() => {
              action.onClick();
              handleClose();
            }}
          >
            {action.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
