import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import PlanManagement from './PlanManagement';
import TaskApprovalQueue from './TaskApprovalQueue';
import WithdrawalApprovalQueue from './WithdrawalApprovalQueue';

type AdminTab = 'dashboard' | 'users' | 'plans' | 'tasks' | 'withdrawals' | 'settings' | 'reports';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const { data: adminData, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === 'dashboard' && <DashboardOverview stats={adminData?.stats} />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'plans' && <PlanManagement />}
            {activeTab === 'tasks' && <TaskApprovalQueue />}
            {activeTab === 'withdrawals' && <WithdrawalApprovalQueue />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'reports' && <AdminReports />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="text-gray-600">System settings management coming soon...</p>
    </div>
  );
}

function AdminReports() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <p className="text-gray-600">Reports and analytics coming soon...</p>
    </div>
  );
}