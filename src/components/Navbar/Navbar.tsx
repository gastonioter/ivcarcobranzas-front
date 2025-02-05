import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAuthToken } from "@/hooks/useAuth";
import { clearCredentials } from "@/redux/slices/auth";
import { StyledNavbar } from "@/styled-components/navbar.styled.component";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isAuth = useAuthToken();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch(clearCredentials());
    navigate("/", { replace: true });
  };

  // const openSidebar = () => {
  //   dialogOpenSubject$.setSubject = true;
  // };

  return (
    <StyledNavbar>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            onClick={openSidebar}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SISTEMA COBRANZAS IVCAR
          </Typography>
          {isAuth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Cerrar Sesion</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </StyledNavbar>
  );
}
