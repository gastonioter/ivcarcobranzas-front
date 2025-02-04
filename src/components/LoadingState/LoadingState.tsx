import { SuspenseFallback } from "@/styled-components";
import logo from "../../assets/logo-ivcar.png";

function LoadingState() {
  return (
    <SuspenseFallback>
      <img src={logo} alt="" width={200} />
    </SuspenseFallback>
  );
}

export default LoadingState;
