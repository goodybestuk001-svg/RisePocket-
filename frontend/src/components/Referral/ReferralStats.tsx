import React from 'react';

interface ReferralStats {
  total_referrals: number;
  qualified_referrals: number;
  pending_referrals: number;
  total_earnings: number;
}

interface ReferralStatsProps {
  stats?: ReferralStats;
}

export default function ReferralStats({ stats }: ReferralStatsProps) {
  const cards = [
    {
      title: 'Total Referrals',
      value: stats?.total_referrals || 0,
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Qualified',
      value: stats?.qualified_referrals || 0,
      icon: '✅',
      color: 'green',
    },
    {
      title: 'Pending',
      value: stats?.pending_referrals || 0,
      icon: '⏳',
      color: 'orange',
    },
    {
      title: 'Total Earnings',
      value: `₦${(stats?.total_earnings || 0).toLocaleString()}`,
      icon: '💰',
      color: 'purple',
    },
  ];

  const colorStyles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  const iconBgStyles = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    orange: 'bg-orange-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${colorStyles[card.color]} border rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${iconBgStyles[card.color]} rounded-full w-12 h-12 flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}