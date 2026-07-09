import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { TaskSubmission } from '../../types';

export default function TaskApprovalQueue() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['adminTaskSubmissions', filter],
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/tasks?status=${filter}`);
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiClient.post(`/api/admin/tasks/${taskId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTaskSubmissions'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: number; reason: string }) => {
      const response = await apiClient.post(`/api/admin/tasks/${taskId}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTaskSubmissions'] });
      setSelectedTask(null);
      setRejectReason('');
    },
  });

  const tasks: TaskSubmission[] = tasksData?.tasks || [];

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Approval Queue</h1>
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({tasks.length})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>No tasks to display</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{task.dailyTask?.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{task.dailyTask?.description}</p>
                </div>
                <span className={`${statusStyles[task.status]} text-xs font-semibold px-3 py-1 rounded-full`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>

              {/* Submission Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Submitted By</p>
                  <p className="font-medium text-gray-900">{task.user?.full_name}</p>
                  <p className="text-xs text-gray-500">{task.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted Date</p>
                  <p className="font-medium text-gray-900">
                    {task.submitted_at ? new Date(task.submitted_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium text-green-600">₦{task.dailyTask?.reward_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Submission Content */}
              {task.submission_text && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900 mb-1">Submission Notes:</p>
                  <p className="text-sm text-gray-600">{task.submission_text}</p>
                </div>
              )}

              {/* Proof Media */}
              {(task.proof_image || task.proof_video || task.proof_url) && (
                <div className="mb-4 space-y-2">
                  {task.proof_image && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Image Proof:</p>
                      <img
                        src={task.proof_image}
                        alt="Proof"
                        className="max-w-xs h-auto rounded border border-gray-200"
                      />
                    </div>
                  )}
                  {task.proof_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Proof URL:</p>
                      <a href={task.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        {task.proof_url}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {task.status === 'pending' && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => approveMutation.mutate(task.id)}
                    disabled={approveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Rejection reason (optional)"
                      value={selectedTask === task.id ? rejectReason : ''}
                      onChange={(e) => setRejectReason(e.target.value)}
                      onFocus={() => setSelectedTask(task.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                    <button
                      onClick={() =>
                        rejectMutation.mutate({
                          taskId: task.id,
                          reason: rejectReason,
                        })
                      }
                      disabled={rejectMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}