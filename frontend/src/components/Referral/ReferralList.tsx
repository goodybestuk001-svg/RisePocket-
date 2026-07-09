import React from 'react';
import { Referral } from '../../types';

interface ReferralListProps {
  referrals?: {
    data: Referral[];
    links?: Record<string, string>;
    meta?: Record<string, any>;
  };
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  rewarded: 'bg-blue-100 text-blue-800',
};

const statusIcons = {
  pending: '⏳',
  qualified: '✅',
  rewarded: '💰',
};

export default function ReferralList({ referrals }: ReferralListProps) {
  const referralList = referrals?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Your Referrals</h2>
      </div>

      {referralList.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 mb-2">No referrals yet</p>
          <p className="text-sm text-gray-400">Share your referral link to start earning</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Referral
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referralList.map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">👤</span>
                      <span className="text-sm font-medium text-gray-900">{referral.referredUser?.full_name || 'User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {referral.referredUser?.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${statusStyles[referral.status]} text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center space-x-1`}>
                      <span>{statusIcons[referral.status]}</span>
                      <span>{referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">₦{referral.reward_amount || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {referral.qualified_at
                      ? new Date(referral.qualified_at).toLocaleDateString()
                      : new Date().toLocaleDateString()}
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