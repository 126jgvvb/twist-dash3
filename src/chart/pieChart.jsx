import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#facc15', '#f97316', '#f45218'];

const ClientsGraphicalData = ({ tokens = [] }) => {
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
    if (isNaN(expiryHours)) continue;

    // Convert hours to seconds for range checks (if needed)
    const expirySeconds = expiryHours * 3600;

    // Handle numeric expiry values (common in vouchers)
    if (obj.payment === undefined) {
      if (expiryHours <= 24) data[0].value += 1; // 1 day
      else if (expiryHours <= 72) data[1].value += 1; // 3 days
      else if (expiryHours <= 168) data[2].value += 1; // 1 week
      else if (expiryHours <= 336) data[3].value += 1; // 2 weeks
      else if (expiryHours > 336) data[4].value += 1; // 1 month+
      continue;
    }

    // Handle expiry string or predefined range
    if (typeof obj.expiry === "string") {
      const e = obj.expiry.toLowerCase();
      if (e.includes("day")) data[0].value += 1;
      else if (e.includes("week")) data[2].value += 1;
      else if (e.includes("month")) data[4].value += 1;
      continue;
    }

    // Handle seconds-based expiry values (common in some APIs)
    if (expirySeconds <= 86400) data[0].value += 1; // 1 day
    else if (expirySeconds <= 259200) data[1].value += 1; // 3 days
    else if (expirySeconds <= 604800) data[2].value += 1; // 1 week
    else if (expirySeconds <= 1209600) data[3].value += 1; // 2 weeks
    else if (expirySeconds > 1209600) data[4].value += 1; // 1 month+
  }

  return (
    <ResponsiveContainer className="graph-height bg-graph-area md:mx-20">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} client(s)`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ClientsGraphicalData;

