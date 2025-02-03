import styled from "styled-components";

export const AppLayout = styled.div`
  background-color: #fafafa;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 62px 1fr;

  grid-template-areas:
    "sidebar navbar"
    "sidebar main";
`;
