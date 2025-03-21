import Drawer from "@mui/material/Drawer";
import SidebarNavigationItems from "./SidebarItems";
import RealTimeClock from "../RealTimeClock/RealTimeClock";

// export const dialogOpenSubject$ = new SubjectManager<boolean>();
// export const dialogCloseSubject$ = new SubjectManager<boolean>();

export default function Sidebar() {
  // const [open, setOpen] = useState(false);

  // let openSubject$ = new Subscription();
  // let closeSubject$ = new Subscription();

  // useEffect(() => {
  //   openSubject$ = dialogOpenSubject$.getSubject.subscribe(() => handleOpen());
  //   closeSubject$ = dialogCloseSubject$.getSubject.subscribe(() =>
  //     handleClose()
  //   );
  //   return () => {
  //     openSubject$.unsubscribe();
  //     closeSubject$.unsubscribe();
  //   };
  // }, []);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleExit = () => {
  //   dialogCloseSubject$.setSubject = false;
  // };

  return (
    <Drawer
      sx={{
        width: {
          lg: 250,
          md: 200,
          xs: 0,
        },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: {
            lg: 250,
            md: 200,
            xs: 0,
          },
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <SidebarNavigationItems />
      <RealTimeClock />
    </Drawer>
  );
}
