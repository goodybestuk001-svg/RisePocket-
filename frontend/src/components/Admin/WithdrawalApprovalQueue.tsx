import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Withdrawal } from '../../types';

export default function WithdrawalApprovalQueue() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processed'>('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: withdrawalsData, isLoading } = useQuery({
    queryKey: ['adminWithdrawals', filter],
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/withdrawals?status=${filter}`);
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (withdrawalId: number) => {
      const response = await apiClient.post(`/api/admin/withdrawals/${withdrawalId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ withdrawalId, reason }: { withdrawalId: number; reason: string }) => {
      const response = await apiClient.post(`/api/admin/withdrawals/${withdrawalId}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
      setSelectedWithdrawal(null);
      setRejectionReason('');
    },
  });

  const processedMutation = useMutation({
    mutationFn: async (withdrawalId: number) => {
      const response = await apiClient.post(`/api/admin/withdrawals/${withdrawalId}/mark-processed`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
    },
  });

  const withdrawals: Withdrawal[] = withdrawalsData?.withdrawals || [];

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
    processed: '💸',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Approvals</h1>
        <div className="flex space-x-2 flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected', 'processed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({withdrawals.length})
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'approved', 'rejected', 'processed'].map((status) => {
          const count = withdrawalsData?.stats?.[`${status}_count`] || 0;
          const amount = withdrawalsData?.stats?.[`${status}_amount`] || 0;
          return (
            <div key={status} className={`${statusStyles[status]} rounded-lg p-4`}>
              <p className="text-sm font-medium opacity-75">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs mt-1 opacity-75">₦{(amount || 0).toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>No withdrawals to display</p>
          </div>
        ) : (
          withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{withdrawal.user?.full_name}</h3>
                  <p className="text-gray-600 text-sm">{withdrawal.user?.email}</p>
                </div>
                <span className={`${statusStyles[withdrawal.status]} text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center space-x-1`}>
                  <span>{statusIcons[withdrawal.status]}</span>
                  <span>{withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}</span>
                </span>
              </div>

              {/* Withdrawal Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200 text-sm">
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-bold text-gray-900 text-lg">₦{withdrawal.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bank</p>
                  <p className="font-bold text-gray-900">{withdrawal.bank_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Account</p>
                  <p className="font-bold text-gray-900">***{withdrawal.account_number.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Requested</p>
                  <p className="font-bold text-gray-900">
                    {withdrawal.requested_at ? new Date(withdrawal.requested_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                <p className="text-gray-600">Account Name: <span className="font-medium text-gray-900">{withdrawal.account_name}</span></p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                {withdrawal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approveMutation.mutate(withdrawal.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Approve
                    </button>
                    <div className="flex-1 flex items-center space-x-2 min-w-max">
                      <input
                        type="text"
                        placeholder="Rejection reason"
                        value={selectedWithdrawal === withdrawal.id ? rejectionReason : ''}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        onFocus={() => setSelectedWithdrawal(withdrawal.id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      />
                      <button
                        onClick={() =>
                          rejectMutation.mutate({
                            withdrawalId: withdrawal.id,
                            reason: rejectionReason,
                          })
                        }
                        disabled={rejectMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}
                {withdrawal.status === 'approved' && (
                  <button
                    onClick={() => processedMutation.mutate(withdrawal.id)}
                    disabled={processedMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Mark as Processed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}