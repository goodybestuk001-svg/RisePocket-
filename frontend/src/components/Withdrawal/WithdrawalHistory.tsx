import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Withdrawal } from '../../types';

interface WithdrawalHistoryProps {
  limit?: number;
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  processed: 'bg-green-100 text-green-800',
};

const statusIcons = {
  pending: '⏳',
  approved: '✅',
  rejected: '❌',
  processed: '💰',
};

export default function WithdrawalHistory({ limit }: WithdrawalHistoryProps) {
  const { data: withdrawalsData, isLoading } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const response = await apiClient.get('/api/withdrawals');
      return response.data;
    },
  });

  const withdrawals: Withdrawal[] = (withdrawalsData?.withdrawals?.data || []).slice(0, limit || 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Withdrawals</h3>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No withdrawals yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">₦{withdrawal.amount.toLocaleString()}</span>
                <span
                  className={`${statusStyles[withdrawal.status]} text-xs font-semibold px-2 py-1 rounded inline-flex items-center space-x-1`}
                >
                  <span>{statusIcons[withdrawal.status]}</span>
                  <span>{withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{withdrawal.bank_name}</p>
              <p className="text-xs text-gray-500">
                {withdrawal.requested_at ? new Date(withdrawal.requested_at).toLocaleDateString() : 'N/A'}
              </p>
              {withdrawal.rejection_reason && (
                <p className="text-xs text-red-600 mt-2">Reason: {withdrawal.rejection_reason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}