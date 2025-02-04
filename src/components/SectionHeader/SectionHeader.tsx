import AddIcon from "@mui/icons-material/Add";
import { Button, Paper, Stack } from "@mui/material";
import { dialogOpenSubject$ } from "../CustomDialog";

interface Props {
  children: React.ReactNode;
  customClickHandler?: () => void;
  showButton?: boolean;
}

export default function SectionHeader({
  children,
  customClickHandler,
  showButton = true,
}: Props) {
  const handleClick = () => {
    if (customClickHandler) {
      customClickHandler();
      return;
    }
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
        {showButton && (
          <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nuevo
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
