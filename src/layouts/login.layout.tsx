import { StyledLoginLayout } from "@/pages/Login/styled-components";
import { Outlet } from "react-router";

export default function LoginLayout() {
  return (
    <StyledLoginLayout>
      <Outlet />
    </StyledLoginLayout>
  );
}
