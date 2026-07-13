import { MonitoreoRenevue } from "@/services/metricsApi";
import { formattedCurrency } from "@/utilities/formatPrice";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <Card sx={{ p: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="body2" color="success.main">
          {formattedCurrency(payload[0].value)}
        </Typography>
      </Card>
    );
  }
  return null;
};

export const RevenueChart = ({ data }: { data?: MonitoreoRenevue[] }) => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2, mt: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={500} mb={3}>
          Monitoreo | Ingresos mensuales
        </Typography>
        <Typography variant="body2" fontWeight={500} mb={3}>
          Ultimos 12 meses
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="month" tick={{ fontSize: 13 }} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4caf50"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ r: 4, fill: "#4caf50" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
