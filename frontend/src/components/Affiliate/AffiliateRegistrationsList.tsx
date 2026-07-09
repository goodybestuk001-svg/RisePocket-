import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { AffiliateRegistration } from '../../types';

interface AffiliateRegistration {
  id: number;
  user_id: number;
  status: 'pending' | 'qualified';
  qualified_at?: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
}

export default function AffiliateRegistrationsList() {
  const { data: registrationsData, isLoading } = useQuery({
    queryKey: ['affiliateRegistrations'],
    queryFn: async () => {
      const response = await apiClient.get('/api/affiliates/registrations');
      return response.data;
    },
  });

  const registrations: AffiliateRegistration[] = registrationsData?.registrations?.data || [];

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
  };

  const statusIcons = {
    pending: '⏳',
    qualified: '✅',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Your Registrations</h2>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 mb-2">No registrations yet</p>
          <p className="text-sm text-gray-400">Share your affiliate link to start building your network</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Qualified Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">👤</span>
                      <span className="text-sm font-medium text-gray-900">
                        {registration.user?.first_name} {registration.user?.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {registration.user?.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${statusStyles[registration.status]} text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center space-x-1`}>
                      <span>{statusIcons[registration.status]}</span>
                      <span>{registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {registration.qualified_at
                      ? new Date(registration.qualified_at).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}