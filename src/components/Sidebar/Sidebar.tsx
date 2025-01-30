import { SubjectManager } from "@/models/subjectmanager";

import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import SidebarNavigationItems from "./SidebarItems";

export const dialogOpenSubject$ = new SubjectManager<boolean>();
export const dialogCloseSubject$ = new SubjectManager<boolean>();

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  let openSubject$ = new Subscription();
  let closeSubject$ = new Subscription();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
    };

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

  const handleExit = () => {
    dialogCloseSubject$.setSubject = false;
  };

  return (
    <Drawer anchor={"left"} variant="temporary" open={open} onClose={() => handleExit()}>
      <SidebarNavigationItems />
    </Drawer>
  );
}
