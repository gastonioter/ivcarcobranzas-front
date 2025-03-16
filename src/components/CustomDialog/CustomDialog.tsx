/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { SubjectManager } from "@/models";
import { Theme } from "@emotion/react";
import { Box, SxProps, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";

interface Props {
  title: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

export const dialogOpenSubject$ = new SubjectManager<boolean>();
export const dialogCloseSubject$ = new SubjectManager<boolean>();

export const CustomDialog = ({ title, sx, children }: Props) => {
  const [open, setOpen] = useState(false);
  let openSubject$ = new Subscription();
  let closeSubject$ = new Subscription();

  useEffect(() => {
    openSubject$ = dialogOpenSubject$.getSubject.subscribe(() => handleOpen());
    closeSubject$ = dialogCloseSubject$.getSubject.subscribe(() =>
      handleClose()
    );
    return () => {
      openSubject$.unsubscribe();
      closeSubject$.unsubscribe();
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleExit = () => {
  //   dialogCloseSubject$.setSubject = false;
  // };

  return (
    <div>
      <Dialog
        open={open}
        // onClose={() => handleExit()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <Box sx={{ p: 5, ...sx }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            {title}
          </Typography>
          {children}
        </Box>
      </Dialog>
    </div>
  );
};

export default CustomDialog;
