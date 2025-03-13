import styled from "styled-components";

export const LayoutSalePayments = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  height: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    grid-template-columns: 1fr;
    grid-template-rows: auto 400px 1fr;
    gap: 1.5rem;
    justify-content: center;
    height: auto;
  }
`;
