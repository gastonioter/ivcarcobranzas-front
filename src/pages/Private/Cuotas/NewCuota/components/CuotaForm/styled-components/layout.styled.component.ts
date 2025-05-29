import styled from "styled-components";

export const CuotaFormLayout = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  height: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 1.5rem;
    justify-content: center;
    height: auto;
  }
`;
