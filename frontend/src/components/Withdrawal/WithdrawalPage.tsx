import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import WithdrawalHistory from './WithdrawalHistory';
import { Wallet } from '../../types';

interface WithdrawalFormData {
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
}

const banks = [
  'Access Bank',
  'Zenith Bank',
  'Guaranty Trust Bank',
  'First Bank',
  'United Bank for Africa',
  'Stanbic IBTC',
  'FCMB',
  'Wema Bank',
  'Polaris Bank',
  'Keystone Bank',
];

export default function WithdrawalPage() {
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: 0,
    bank_name: '',
    account_number: '',
    account_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await apiClient.get('/api/wallet/balance');
      return response.data;
    },
  });

  const wallet: Wallet | undefined = walletData?.wallet;
  const minimumWithdrawal = 5000;
  const processingTime = '24-48 hours';

  const withdrawalMutation = useMutation({
    mutationFn: async (data: WithdrawalFormData) => {
      const response = await apiClient.post('/api/withdrawals', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData({ amount: 0, bank_name: '', account_number: '', account_name: '' });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to request withdrawal');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || formData.amount < minimumWithdrawal) {
      setError(`Minimum withdrawal amount is ₦${minimumWithdrawal.toLocaleString()}`);
      return;
    }

    if (formData.amount > (wallet?.available_balance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (!formData.bank_name || !formData.account_number || !formData.account_name) {
      setError('Please fill in all required fields');
      return;
    }

    withdrawalMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Request Withdrawal</h1>
        <p className="text-gray-600 mb-8">Withdraw your earnings to your bank account</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Withdrawal Details</h2>

              {/* Wallet Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-blue-900">₦{(wallet?.total_balance || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-blue-900">₦{(wallet?.available_balance || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Minimum Withdrawal</p>
                  <p className="text-lg font-bold text-blue-900">₦{minimumWithdrawal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Processing Time</p>
                  <p className="text-lg font-bold text-blue-900">{processingTime}</p>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">✓ Withdrawal request submitted successfully!</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">✗ {error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-lg text-gray-500">₦</span>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum: ₦{minimumWithdrawal.toLocaleString()}</p>
                </div>

                {/* Bank Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <select
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select your bank</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="0123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={withdrawalMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  {withdrawalMutation.isPending ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Important Information</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Withdrawals are processed {processingTime}</li>
                  <li>✓ Your account details are securely encrypted</li>
                  <li>✓ You can track your withdrawal status anytime</li>
                  <li>✓ Multiple withdrawals can be requested</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Recent Withdrawals */}
          <div>
            <WithdrawalHistory />
          </div>
        </div>
      </div>
    </div>
  );
}