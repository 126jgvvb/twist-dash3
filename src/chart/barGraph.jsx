import React from 'react';
import {
  BarChart,
  Bar,
  Label,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#facc15', '#f97316', '#f45218'];

const BarX = ({ tokens = [] }) => {
  const data = [
    { name: "1 day", value: 0 },
    { name: "3 days", value: 0 },
    { name: "1 week", value: 0 },
    { name: "2 weeks", value: 0 },
    { name: "1 month", value: 0 }
  ];

  for (const obj of tokens) {
    if (!obj || obj.status !== "access granted") continue;

    let expiryHours = Number(obj.expiry);
    if (isNaN(expiryHours)) {
      // If expiry is a string like "1 day", "1 week", etc.
      const e = (obj.expiry || "").toLowerCase();
      if (e.includes("day")) data[0].value += 1;
      else if (e.includes("week")) data[2].value += 1;
      else if (e.includes("month")) data[4].value += 1;
      continue;
    }

    // If expiry provided in hours or numeric value
    if (obj.payment === undefined) {
      if (expiryHours <= 24) data[0].value += 1; // 1 day
      else if (expiryHours <= 72) data[1].value += 1; // 3 days
      else if (expiryHours <= 168) data[2].value += 1; // 1 week
      else if (expiryHours <= 336) data[3].value += 1; // 2 weeks
      else if (expiryHours > 336) data[4].value += 1; // 1 month+
    } else {
      // expiry given in seconds, fallback case
      const expirySeconds = expiryHours * 3600;
      if (expirySeconds <= 86400) data[0].value += 1; // 1 day
      else if (expirySeconds <= 259200) data[1].value += 1; // 3 days
      else if (expirySeconds <= 604800) data[2].value += 1; // 1 week
      else if (expirySeconds <= 1209600) data[3].value += 1; // 2 weeks
      else data[4].value += 1; // 1 month+
    }
  }

  return (
    <ResponsiveContainer
      className="min-w-screen/20 graph-height bg-graph-area min-h-screen/20"
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{ fill: 'white' }}>
          <Label value="Period" offset={-20} position="insideBottom" />
        </XAxis>
        <YAxis
          type="number"
          domain={[0, 'auto']}
          dataKey="value"
          style={{ fill: 'white' }}
        >
          <Label value="Clients" angle={-90} position="insideLeft" />
        </YAxis>

        <Tooltip
          formatter={(value) => `${value} clients`}
          labelFormatter={(label) => `${label}`}
        />
        <Legend />

        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          isAnimationActive={true}
          animationDuration={1000}
          animationBegin={300}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarX;

