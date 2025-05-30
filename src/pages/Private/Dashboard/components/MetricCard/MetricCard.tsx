import {
  Box,
  Card,
  CardContent,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

interface MetricCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: JSX.Element;
  color?:
    | "primary"
    | "disabled"
    | "action"
    | "inherit"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  sx?: SxProps<Theme>;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description = "",
  color = "primary",
  icon,
  sx = {},
  children,
}) => {
  return (
    <Card sx={{ minWidth: 250, borderRadius: 2, boxShadow: 3, p: 2, ...sx }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={500}>
            {title}
          </Typography>
          {icon}
        </Box>

        <Typography variant="h2" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
        {children && <Box mt={"auto"}>{children}</Box>}
      </CardContent>
    </Card>
  );
};
