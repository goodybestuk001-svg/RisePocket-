import React from 'react';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function AdminHeader({ sidebarOpen, onSidebarToggle }: AdminHeaderProps) {
  return (
    <div className="bg-white shadow-md px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold text-gray-900">RisePocket- Admin</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            🔔
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}