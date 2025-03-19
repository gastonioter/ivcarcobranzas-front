import styled from "styled-components";

export const MetricsLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-template-rows: 220px 220px;
  gap: 1rem;
  /* height: 100%; */
  margin-top: 1rem;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 1.5rem;
    justify-content: center;
    height: auto;
  }
`;
