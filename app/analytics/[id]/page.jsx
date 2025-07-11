'use client';
import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatisticsPage() {
  const { id } = useParams();
  const flowId = id; // Flow ID from URL params

  const [stats, setStats] = useState({
    totals: { daily: 0, weekly: 0, monthly: 0, yearly: 0, allTime: 0 },
    byCountry: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/flow/statistics/${flowId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch statistics: ${response.statusText}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (flowId) {
      fetchStats();
    }
  }, [flowId]);

  // Bar chart data for total unique users
  const barData = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'],
    datasets: [
      {
        label: 'Unique Users',
        data: [
          stats.totals.daily,
          stats.totals.weekly,
          stats.totals.monthly,
          stats.totals.yearly,
          stats.totals.allTime,
        ],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for user distribution by time period
  const pieData = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    datasets: [
      {
        data: [
          stats.totals.daily,
          stats.totals.weekly,
          stats.totals.monthly,
          stats.totals.yearly,
        ],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(196, 181, 253, 0.8)',
        ],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for country distribution (e.g., daily interactions by country)
  const countryBarData = {
    labels: stats.byCountry.map((countryStat) => countryStat.country || 'Unknown'),
    datasets: [
      {
        label: 'Daily Unique Users by Country',
        data: stats.byCountry.map((countryStat) => countryStat.daily),
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green for country data
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg m-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
          Chatbot Interaction Statistics
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Unique users who interacted with your chatbot (Flow ID: {flowId})
        </p>

        {/* Summary Cards for Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {['daily', 'weekly', 'monthly', 'yearly', 'allTime'].map((period) => (
            <motion.div
              key={period}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * ['daily', 'weekly', 'monthly', 'yearly', 'allTime'].indexOf(period) }}
            >
              <h3 className="text-lg font-semibold text-gray-700 capitalize">{period}</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.totals[period]}</p>
              <p className="text-sm text-gray-500">Unique Users</p>
            </motion.div>
          ))}
        </div>

        {/* Charts for Total Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interaction Trends</h2>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(79, 70, 229, 0.8)' } },
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Unique Users' } } },
              }}
            />
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interaction Distribution</h2>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' }, tooltip: { backgroundColor: 'rgba(79, 70, 229, 0.8)' } },
              }}
            />
          </motion.div>
        </div>

        {/* Country Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Interactions by Country</h2>
          {stats.byCountry.length > 0 ? (
            <Bar
              data={countryBarData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: 'rgba(34, 197, 94, 0.8)' },
                },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Unique Users' } },
                  x: { title: { display: true, text: 'Country' } },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 text-center">No country data available</p>
          )}
        </div>

        {/* Country Details Table */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Country Breakdown</h2>
          {stats.byCountry.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Daily
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weekly
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yearly
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      All Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.byCountry.map((countryStat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {countryStat.country || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{countryStat.daily}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{countryStat.weekly}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{countryStat.monthly}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{countryStat.yearly}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{countryStat.allTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No country data available</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}