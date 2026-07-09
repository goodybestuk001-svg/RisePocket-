import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { User } from '../../types';

interface UserWithStats extends User {
  wallet_balance?: number;
  total_referrals?: number;
  activation_plan_name?: string;
}

export default function UserManagement() {
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [search, setSearch] = useState('');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers', filter],
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/users?status=${filter}`);
      return response.data;
    },
  });

  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiClient.patch(`/api/admin/users/${userId}/suspend`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const users: UserWithStats[] = usersData?.users || [];
  const filteredUsers = users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));

  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Export Users
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <div className="flex space-x-2">
            {['all', 'active', 'suspended', 'banned'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Activation Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Wallet Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.activation_plan_name || 'Not Activated'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{(user.wallet_balance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.total_referrals || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${statusStyles[user.status]} text-xs font-semibold px-3 py-1 rounded-full`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">View</button>
                      <button
                        onClick={() => suspendMutation.mutate(user.id)}
                        disabled={suspendMutation.isPending}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}