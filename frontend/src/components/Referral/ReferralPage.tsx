import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { useClipboard } from '../../hooks/useClipboard';
import ReferralStats from './ReferralStats';
import ReferralList from './ReferralList';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const { copyToClipboard } = useClipboard();

  const { data: referralData, isLoading } = useQuery({
    queryKey: ['referralProgram'],
    queryFn: async () => {
      const response = await apiClient.get('/api/referrals');
      return response.data;
    },
  });

  const referralCode = referralData?.referral_code;
  const referralUrl = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading referral program...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Referral Program</h1>
        <p className="text-gray-600 mb-8">Earn ₦250 for every person you refer who activates their account</p>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between space-x-4">
              <code className="text-sm break-all">{referralUrl}</code>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded font-medium transition-colors whitespace-nowrap ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
          <p className="text-blue-100 text-sm">Share this link with friends to earn rewards when they join</p>
        </div>

        {/* Stats Section */}
        <ReferralStats stats={referralData?.stats} />

        {/* Referrals List */}
        <ReferralList referrals={referralData?.referrals} />
      </div>
    </div>
  );
}