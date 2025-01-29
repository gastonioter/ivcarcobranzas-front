import { Outlet } from "react-router";
import { StyledAppLayout } from "@/styled-components";

export default function AppLayout() {
  return (
    <StyledAppLayout>
      <Outlet />
    </StyledAppLayout>
  );
}
