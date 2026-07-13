import { Card, CardContent, Typography } from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ClientesPieChartProps {
  actives: number;
  inactives: number;
}

const COLORS = ["#4caf50", "#f44336"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <Card sx={{ p: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {payload[0].name}: {payload[0].value}
        </Typography>
      </Card>
    );
  }
  return null;
};

export const ClientesPieChart = ({
  actives,
  inactives,
}: ClientesPieChartProps) => {
  const data = [
    { name: "Activos", value: actives },
    { name: "De Baja", value: inactives },
  ];

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2, mt: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={500} mb={3}>
          Estado de clientes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent as number) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
