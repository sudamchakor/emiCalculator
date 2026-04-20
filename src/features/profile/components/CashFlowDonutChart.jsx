import React from "react";
import { Paper, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { useSelector } from "react-redux";
import { selectCurrency } from "../../../store/emiSlice";

const PIE_CHART_COLORS = ["#ff6b6b", "#4ecdc4", "#9c27b0", "#2ecc71", "#f1c40f"];

export default function CashFlowDonutChart({ donutData }) {
  const currency = useSelector(selectCurrency);

  const formatCurrency = (val) =>
    `${currency}${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" align="center" gutterBottom>
        Monthly Cash Flow Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={donutData}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {donutData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
