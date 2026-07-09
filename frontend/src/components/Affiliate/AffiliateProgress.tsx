import React from 'react';

interface Progress {
  current: number;
  target: number;
  percentage: number;
}

interface Affiliate {
  id: number;
  total_registrations: number;
  qualified_registrations: number;
  reward_amount: number;
  reward_thresholds?: Record<string, number>;
}

interface AffiliateProgressProps {
  progress?: Progress;
  affiliate?: Affiliate;
}

export default function AffiliateProgress({ progress, affiliate }: AffiliateProgressProps) {
  const current = progress?.current || 0;
  const target = progress?.target || 100;
  const percentage = progress?.percentage || 0;

  const milestones = [
    { threshold: 25, reward: 5000, label: '25' },
    { threshold: 50, reward: 10000, label: '50' },
    { threshold: 100, reward: 20000, label: '100' },
    { threshold: 200, reward: 50000, label: '200' },
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Main Progress Card */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Progress to Reward</h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Qualified Registrations</span>
            <span className="text-sm font-bold text-gray-900">
              {current} / {target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-purple-800 h-full transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-purple-600">{Math.round(percentage)}%</span> complete
          </div>
        </div>

        {/* Status Message */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-purple-900 font-medium">
            {current === 0
              ? '🚀 Just getting started! Share your link to begin earning.'
              : current < 25
              ? '💪 Great start! Keep it up!'
              : current < 50
              ? '🔥 You\'re on fire! Halfway to the first reward!'
              : current < 100
              ? '⭐ Incredible progress! Almost there!'
              : '🎉 Congratulations! You\'ve reached the first milestone!'}
          </p>
        </div>

        {/* Earnings Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Current Earnings</p>
            <p className="text-3xl font-bold text-gray-900">₦{(affiliate?.reward_amount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 mb-1">Next Milestone</p>
            <p className="text-3xl font-bold text-purple-900">₦20,000</p>
            <p className="text-xs text-purple-600 mt-1">at {target} qualifications</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Reward Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone, index) => {
            const isCompleted = current >= milestone.threshold;
            const isNext = current < milestone.threshold && index > 0 && current >= milestones[index - 1]?.threshold;

            return (
              <div
                key={milestone.threshold}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-50 border-green-300'
                    : isNext
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Threshold</p>
                    <p className="text-2xl font-bold text-gray-900">{milestone.label}</p>
                    <p className="text-xs text-gray-500 mt-1">registrations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 mb-1">Reward</p>
                    <p className={`text-2xl font-bold ${
                      isCompleted
                        ? 'text-green-600'
                        : isNext
                        ? 'text-purple-600'
                        : 'text-gray-400'
                    }`}>
                      ₦{milestone.reward.toLocaleString()}
                    </p>
                    {isCompleted && <p className="text-xs font-semibold text-green-600 mt-1">✓ Earned</p>}
                    {isNext && <p className="text-xs font-semibold text-purple-600 mt-1">🎯 Next</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}