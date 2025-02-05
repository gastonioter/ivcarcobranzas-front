import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

export default function RealTimeClock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <Typography
      variant="body2"
      sx={{
        textAlign: "center",
        marginTop: "auto",
        p: 5,
      }}
      color="textSecondary"
    >
      {dateTime.toLocaleString()}
    </Typography>
  );
}
