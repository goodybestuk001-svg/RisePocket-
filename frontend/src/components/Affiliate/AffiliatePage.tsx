import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { useClipboard } from '../../hooks/useClipboard';
import AffiliateProgress from './AffiliateProgress';
import AffiliateRegistrationsList from './AffiliateRegistrationsList';

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const { copyToClipboard } = useClipboard();

  const { data: affiliateData, isLoading } = useQuery({
    queryKey: ['affiliateProgram'],
    queryFn: async () => {
      const response = await apiClient.get('/api/affiliates/info');
      return response.data;
    },
  });

  const affiliate = affiliateData?.affiliate;
  const progress = affiliateData?.progress;
  const affiliateUrl = affiliateData?.affiliate_url;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(affiliateUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading affiliate program...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Affiliate Program</h1>
        <p className="text-gray-600 mb-8">
          Earn ₦20,000 when 100 people register through your link and activate their accounts
        </p>

        {/* Affiliate Link Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-lg font-semibold mb-4">Your Affiliate Link</h2>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between space-x-4">
              <code className="text-sm break-all">{affiliateUrl}</code>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded font-medium transition-colors whitespace-nowrap ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
          <p className="text-purple-100 text-sm">Share your affiliate link to earn ₦20,000 when 100 people register</p>
        </div>

        {/* Progress Section */}
        <AffiliateProgress progress={progress} affiliate={affiliate} />

        {/* Registrations List */}
        <AffiliateRegistrationsList />
      </div>
    </div>
  );
}