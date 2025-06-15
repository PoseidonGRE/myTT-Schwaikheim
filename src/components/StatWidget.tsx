import React from "react";
import { Paper, Typography } from "@mui/material";

interface StatWidgetProps {
  title: string;
  value: number | string;
  color?: "primary" | "info" | "secondary" | "success" | "error" | "warning" | "default";
}

const StatWidget: React.FC<StatWidgetProps> = ({ title, value, color = "primary" }) => (
  <Paper elevation={3} style={{ padding: 16, minWidth: 120, borderRadius: 18 }}>
    <Typography variant="caption" color="textSecondary">{title}</Typography>
    <Typography variant="h4" color={color} fontWeight={800} sx={{ lineHeight: 1.2 }}>
      {value}
    </Typography>
  </Paper>
);

export default StatWidget;
