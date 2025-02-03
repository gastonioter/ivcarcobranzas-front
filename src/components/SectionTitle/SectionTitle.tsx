import { Typography } from "@mui/material";

interface Props {
  children: string;
}
export default function SectionTitle({ children }: Props) {
  return (
    <Typography
      gutterBottom
      variant="h5"
      sx={{ borderRight: 2, borderColor: "#D3D3D3", px: 2, py: 1 }}
    >
      {children}
    </Typography>
  );
}
