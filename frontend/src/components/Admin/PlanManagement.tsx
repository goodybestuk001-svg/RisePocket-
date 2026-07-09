import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { ActivationPlan } from '../../types';

interface PlanFormData {
  name: string;
  activation_fee: number;
  daily_tasks: number;
  reward_per_task: number;
  description: string;
}

export default function PlanManagement() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    activation_fee: 0,
    daily_tasks: 0,
    reward_per_task: 0,
    description: '',
  });

  const queryClient = useQueryClient();

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['adminPlans'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/activation-plans');
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      if (editingId) {
        const response = await apiClient.put(`/api/admin/activation-plans/${editingId}`, data);
        return response.data;
      } else {
        const response = await apiClient.post('/api/admin/activation-plans', data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
      setEditingId(null);
      setFormData({ name: '', activation_fee: 0, daily_tasks: 0, reward_per_task: 0, description: '' });
    },
  });

  const plans: ActivationPlan[] = plansData?.plans || [];

  const handleEdit = (plan: ActivationPlan) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      activation_fee: plan.activation_fee,
      daily_tasks: plan.daily_tasks,
      reward_per_task: plan.reward_per_task,
      description: plan.description || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Activation Plans Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Plan' : 'Create Plan'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activation Fee (₦)</label>
              <input
                type="number"
                value={formData.activation_fee}
                onChange={(e) => setFormData({ ...formData, activation_fee: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Tasks</label>
              <input
                type="number"
                value={formData.daily_tasks}
                onChange={(e) => setFormData({ ...formData, daily_tasks: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward Per Task (₦)</label>
              <input
                type="number"
                value={formData.reward_per_task}
                onChange={(e) => setFormData({ ...formData, reward_per_task: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Plan'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', activation_fee: 0, daily_tasks: 0, reward_per_task: 0, description: '' });
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Plans List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading plans...</div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Activation Fee</p>
                    <p className="font-bold text-gray-900">₦{plan.activation_fee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Daily Tasks</p>
                    <p className="font-bold text-gray-900">{plan.daily_tasks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reward/Task</p>
                    <p className="font-bold text-gray-900">₦{plan.reward_per_task.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(plan)}
                  className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                >
                  Edit Plan
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}