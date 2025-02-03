import { Typography } from "@mui/material";

interface Props {
  children: string;
}
export default function SectionTitle({ children }: Props) {
  return (
    <Typography gutterBottom variant="h1">
      {children.toUpperCase()}
    </Typography>
  );
}
