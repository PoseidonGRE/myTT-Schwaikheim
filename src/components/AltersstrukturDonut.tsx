import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Mitglied } from "../types/mitglied";
import dayjs from "dayjs";

interface Props {
  mitglieder: Mitglied[];
}

export default function AltersstrukturDonut({ mitglieder }: Props) {
  // Alter bestimmen, Buckets bauen
  const now = dayjs();
  const altersgruppen = { "U18": 0, "18-40": 0, "40+": 0 };
  mitglieder.forEach(m => {
    if (!m.geburtstag) return;
    const age = now.diff(dayjs(m.geburtstag), "year");
    if (age < 18) altersgruppen["U18"]++;
    else if (age <= 40) altersgruppen["18-40"]++;
    else altersgruppen["40+"]++;
  });
  const data = Object.entries(altersgruppen).map(([name, value]) => ({ name, value }));

  const COLORS = ["#4f8cff", "#5eead4", "#fbbf24"];

  return (
    <ResponsiveContainer width="100%" height={270}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={88}
          innerRadius={56}
          label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          isAnimationActive
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="center" verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
}
