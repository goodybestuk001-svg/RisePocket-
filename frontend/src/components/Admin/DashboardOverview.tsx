import React from 'react';

interface AdminStats {
  total_users?: number;
  active_users?: number;
  total_revenue?: number;
  pending_withdrawals?: number;
  approved_tasks?: number;
  total_tasks?: number;
}

interface DashboardOverviewProps {
  stats?: AdminStats;
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: '👥',
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Active Users',
      value: stats?.active_users || 0,
      icon: '🟢',
      color: 'green',
      trend: '+8%',
    },
    {
      title: 'Total Revenue',
      value: `₦${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: '💰',
      color: 'purple',
      trend: '+24%',
    },
    {
      title: 'Pending Withdrawals',
      value: stats?.pending_withdrawals || 0,
      icon: '⏳',
      color: 'orange',
      trend: '-3%',
    },
  ];

  const colorStyles = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  const colorTextStyles = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
    orange: 'text-orange-700',
  };

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${colorStyles[card.color]} border rounded-lg p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${colorTextStyles[card.color]} mb-1`}>
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className={`text-xs mt-2 ${card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend} from last month
                </p>
              </div>
              <div className="text-4xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and more details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 bg-gradient-to-b from-blue-100 to-blue-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder - Integrate with Chart.js or Recharts</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Task Approval Rate</span>
              <span className="font-bold text-green-600">
                {Math.round(((stats?.approved_tasks || 0) / (stats?.total_tasks || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${Math.round(((stats?.approved_tasks || 0) / (stats?.total_tasks || 1)) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}