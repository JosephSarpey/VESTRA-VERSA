import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "recharts";
import axios from "axios";

const API_BASE = "/api/admin/analytics";

const groupOptions = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" }
];

const AdminAnalytics = () => {
  const [groupBy, setGroupBy] = useState("week");
  const [userData, setUserData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/users-over-time?groupBy=${groupBy}`)
      .then(res => setUserData(res.data))
      .catch(() => setUserData([]));
    axios.get(`${API_BASE}/sales-over-time?groupBy=${groupBy}`)
      .then(res => setSalesData(res.data))
      .catch(() => setSalesData([]));
  }, [groupBy]);

  return (
    <div>
      <h2>Admin Analytics</h2>
      <div style={{ marginBottom: 20 }}>
        <label>Group By: </label>
        <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
          {groupOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <h3>User Registrations Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" name="Users" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Sales/Revenue Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSales" fill="#82ca9d" name="Total Sales" />
          <Bar dataKey="orderCount" fill="#8884d8" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminAnalytics;