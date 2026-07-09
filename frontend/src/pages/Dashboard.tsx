import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import DashboardStats from '../Dashboard/DashboardStats';
import TasksSection from '../Dashboard/TasksSection';
import RecentActivity from '../Dashboard/RecentActivity';

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">RisePocket- Dashboard</h1>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome, {dashboardData?.user?.first_name}!</h2>
          <p className="text-blue-100">
            {dashboardData?.user?.is_activated
              ? 'You are all set to start earning with RisePocket-!'
              : 'Activate your account to start earning rewards on RisePocket-.'
            }
          </p>
        </div>

        {/* Statistics Cards */}
        <DashboardStats stats={dashboardData?.stats} />

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TasksSection />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}