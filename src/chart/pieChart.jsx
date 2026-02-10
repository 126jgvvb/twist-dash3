import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#facc15', '#f97316', '#f45218'];

const ClientsGraphicalData = ({ tokens = [] }) => {
  const data = [
    { name: "1hr", value: 0 },
    { name: "2hr", value: 0 },
    { name: "4hr", value: 0 },
    { name: "6hr", value: 0 },
    { name: "12hr", value: 0 },
    { name: "24hr", value: 0 },
    { name: "1 week", value: 0 },
    { name: "2 weeks", value: 0 },
    { name: "1 month", value: 0 }
  ];


  for (const obj of tokens) {
    if (!obj || (obj.status !== "connected" && obj.isBound !== "true" && obj.status !== "active")) continue;

    // Handle voucher duration format (e.g., '1min' -> '1', '2hr' -> '2')
    let expiryHours = 0;
    let expirySeconds = 0;

    if (obj.duration) {
      // Remove any units (like 'min', 'hr', 'hour', 'day', 'week', 'month')
    //  const durationStr = obj.duration.replace(/[^0-9.]/g, '');
    //  const duration = parseFloat(durationStr);
      const duration=obj.duration;
     
      if (typeof obj.duration === "number" || !isNaN(Number(obj.duration))) {
        expiryHours = Number(obj.duration);
        expirySeconds = expiryHours * 3600;
      }
     else if (typeof obj.duration === "string") {
       // Determine unit from original string
       const unit = obj.duration.toLowerCase();
       if (unit.includes("min")) {
         expiryHours = duration / 60; // Convert minutes to hours
         expirySeconds = duration * 60;
       } else if (unit.includes("hr") || unit.includes("hour")) {
         expiryHours = duration;
         expirySeconds = duration * 3600;
       } else if (unit.includes("day")) {
         expiryHours = duration * 24;
         expirySeconds = duration * 86400;
       } else if (unit.includes("week")) {
         expiryHours = duration * 168;
         expirySeconds = duration * 604800;
       } else if (unit.includes("month")) {
         expiryHours = duration * 730;
         expirySeconds = duration * 2592000;
       }
      }
   
    } else if (obj.expiry) {
      // If duration not available, fall back to expiry
      if (typeof obj.expiry === "number" || !isNaN(Number(obj.expiry))) {
        expiryHours = Number(obj.expiry);
        expirySeconds = expiryHours * 3600;
      } else if (typeof obj.expiry === "string") {
        const e = obj.expiry.toLowerCase();
        if (e.includes("hr") || e.includes("hour")) {
          expiryHours = parseFloat(e);
          expirySeconds = expiryHours * 3600;
        } else if (e.includes("day")) {
          expiryHours = parseFloat(e) * 24;
          expirySeconds = expiryHours * 3600;
        } else if (e.includes("week")) {
          expiryHours = parseFloat(e) * 168;
          expirySeconds = expiryHours * 3600;
        } else if (e.includes("month")) {
          expiryHours = parseFloat(e) * 730;
          expirySeconds = expiryHours * 3600;
        }
      }
    } else if (obj.expiryTime) {
      // If expiryTime is available (ISO date)
      const expiryDate = new Date(obj.expiryTime);
      const currentDate = new Date();
      const timeDiff = expiryDate - currentDate;
      expirySeconds = timeDiff / 1000;
      expiryHours = expirySeconds / 3600;
    }

    // Categorize by duration
    if (expiryHours <= 1) data[0].value += 1; // 1hr
    else if (expiryHours <= 2) data[1].value += 1; // 2hr
    else if (expiryHours <= 4) data[2].value += 1; // 4hr
    else if (expiryHours <= 6) data[3].value += 1; // 6hr
    else if (expiryHours <= 12) data[4].value += 1; // 12hr
    else if (expiryHours <= 24) data[5].value += 1; // 24hr
    else if (expiryHours <= 168) data[6].value += 1; // 1 week
    else if (expiryHours <= 336) data[7].value += 1; // 2 weeks
    else if (expiryHours > 336) data[8].value += 1; // 1 month+
  }

  return (
    <ResponsiveContainer className="graph-height md:mx-20">
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

