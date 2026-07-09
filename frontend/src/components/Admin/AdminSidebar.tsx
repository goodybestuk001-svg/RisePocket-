import React from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const menuItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '👥', label: 'Users', id: 'users' },
  { icon: '📦', label: 'Plans', id: 'plans' },
  { icon: '✅', label: 'Task Approvals', id: 'tasks' },
  { icon: '💸', label: 'Withdrawals', id: 'withdrawals' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
  { icon: '📈', label: 'Reports', id: 'reports' },
];

export default function AdminSidebar({ isOpen, activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="hidden md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">RisePocket-</h1>
          <p className="text-blue-200 text-sm">Admin Panel</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                activeTab === item.id
                  ? 'bg-white text-blue-900 font-semibold'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium text-sm">
            Logout
          </button>
        </div>
      </div>
    </>
  );
}