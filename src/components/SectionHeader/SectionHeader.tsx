import AddIcon from "@mui/icons-material/Add";
import { Button, Paper, Stack } from "@mui/material";
import { dialogOpenSubject$ } from "../CustomDialog";

interface Props {
  children: React.ReactNode;
}

export default function SectionHeader({ children }: Props) {
  const handleClick = () => {
    dialogOpenSubject$.setSubject = true;
  };

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

        <Button
          onClick={handleClick}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nuevo
        </Button>
      </Stack>
    </Paper>
  );
}
