import AddIcon from "@mui/icons-material/Add";
import { Button, Paper, Stack } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export default function SectionHeader({ children }: Props) {
  return (
    <Paper
      sx={{
        py: (theme) => theme.spacing(4),
        px: (theme) => theme.spacing(2),
        marginBottom: 2,
        boxShadow: 2,
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="space-between">
        {children}

        <Button variant="contained" startIcon={<AddIcon />}>
          Nuevo
        </Button>
      </Stack>
    </Paper>
  );
}
