import { useParams } from "react-router";

export default function CustomerDetail() {
  const { uuid } = useParams();
  return (
    <>
      <h1>CustomerDetail {uuid}</h1>
    </>
  );
}
