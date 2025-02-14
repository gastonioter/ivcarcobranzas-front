import styled from "styled-components";

export const AppLayout = styled.div`
  background-color: #fafafa;
  height: 100dvh;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 62px 1fr;
  align-items: stretch;
  grid-template-areas:
    "sidebar navbar"
    "sidebar main";

  ${({ theme }) => theme.breakpoints.down("lg")} {
    grid-template-columns: 200px 1fr; /* achica el sidebar */
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    grid-template-columns: 1fr;
    grid-template-areas:
      "navbar"
      "main"; /* Oculta sidebar en móviles */
  }
`;
