import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { StyledMainContent } from "@/styled-components";

export default function AppContainer({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <StyledMainContent>{children}</StyledMainContent>
    </>
  );
}
