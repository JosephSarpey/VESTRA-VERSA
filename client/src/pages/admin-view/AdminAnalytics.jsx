import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer
} from "recharts";
import axios from "axios";
import { format } from "date-fns";

const API_BASE = "/api/admin/analytics";

const groupOptions = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" }
];

// Helper to get current period string for month/week
function getCurrentPeriod(groupBy) {
  const now = new Date();
  if (groupBy === "month") return format(now, "yyyy-MM");
  // For ISO week: yyyy-ww
  const week = format(now, "II");
  const year = format(now, "yyyy");
  return `${year}-${week}`;
}

const AdminAnalytics = () => {
  const [groupBy, setGroupBy] = useState("week");
  const [userData, setUserData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // KPI calculations
  const totalUsers = userData.reduce((sum, d) => sum + d.count, 0);
  const totalSales = salesData.reduce((sum, d) => sum + (d.totalSales || 0), 0);
  const currentPeriod = getCurrentPeriod(groupBy);
  const ordersThisPeriod = salesData.find(d => d.period === currentPeriod)?.orderCount || 0;
  const revenueThisPeriod = salesData.find(d => d.period === currentPeriod)?.totalSales || 0;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      axios.get(`${API_BASE}/users-over-time?groupBy=${groupBy}`),
      axios.get(`${API_BASE}/sales-over-time?groupBy=${groupBy}`)
    ])
      .then(([userRes, salesRes]) => {
        setUserData(userRes.data);
        setSalesData(salesRes.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics data.");
        setIsLoading(false);
      });
  }, [groupBy]);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Total Users</span>
          <span className="text-2xl font-bold text-blue-600">{totalUsers}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Total Sales</span>
          <span className="text-2xl font-bold text-green-600">₦{totalSales.toLocaleString()}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm">
            Orders ({groupBy === "week" ? "This Week" : "This Month"})
          </span>
          <span className="text-2xl font-bold text-purple-600">{ordersThisPeriod}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm">
            Revenue ({groupBy === "week" ? "This Week" : "This Month"})
          </span>
          <span className="text-2xl font-bold text-yellow-600">₦{revenueThisPeriod.toLocaleString()}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">Group By:</label>
        <select
          className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={groupBy}
          onChange={e => setGroupBy(e.target.value)}
        >
          {groupOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading analytics...</div>
      )}
      {error && (
        <div className="text-center py-8 text-red-500">{error}</div>
      )}

      {!isLoading && !error && (
        <>
          {/* User Registrations Chart */}
          <div className="bg-white shadow rounded-lg p-6 mb-8 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">User Registrations Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales/Revenue Chart */}
          <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Sales/Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#22c55e" name="Total Sales" />
                <Bar dataKey="orderCount" fill="#6366f1" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;