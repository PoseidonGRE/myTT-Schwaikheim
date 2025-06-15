import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Mitglied } from "../types/mitglied";
import dayjs from "dayjs";

interface Props {
  mitglieder: Mitglied[];
}

export default function MitgliederChart({ mitglieder }: Props) {
  // Daten auf Monatsbasis kumulieren
  const counts: Record<string, number> = {};

  mitglieder.forEach(m => {
    if (m.eintrittsdatum) {
      const eintritt = dayjs(m.eintrittsdatum);
      const key = eintritt.format("YYYY-MM");
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  // Nur Monate mit gültigem Datum, dann unique & sortiert
  const months = Array.from(new Set(
    mitglieder
      .map(m => m.eintrittsdatum ? dayjs(m.eintrittsdatum).format("YYYY-MM") : undefined)
      .filter((m): m is string => typeof m === "string")
      .sort()
  ));

  // Kumulierte Werte aufbauen
  let cum = 0;
  const data = months.map(month => {
    cum += counts[month] || 0;
    return { monat: month, anzahl: cum };
  });

  return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorMember" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
        <XAxis dataKey="monat" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="anzahl"
          stroke="#4f8cff"
          strokeWidth={3.5}
          dot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 10, fill: "#4f8cff", stroke: "#fff", strokeWidth: 3 }}
          fill="url(#colorMember)"
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
