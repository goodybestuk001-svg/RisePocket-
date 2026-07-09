import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Notification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const notificationIcons: Record<string, string> = {
  task_approval: '✅',
  task_rejection: '❌',
  referral_reward: '💸',
  affiliate_reward: '🎯',
  withdrawal_approved: '✓',
  withdrawal_rejected: '✗',
  withdrawal_processed: '💰',
  new_task: '📋',
  announcement: '📢',
};

const notificationColors: Record<string, string> = {
  task_approval: 'bg-green-50 border-green-200',
  task_rejection: 'bg-red-50 border-red-200',
  referral_reward: 'bg-blue-50 border-blue-200',
  affiliate_reward: 'bg-purple-50 border-purple-200',
  withdrawal_approved: 'bg-blue-50 border-blue-200',
  withdrawal_rejected: 'bg-red-50 border-red-200',
  withdrawal_processed: 'bg-green-50 border-green-200',
  new_task: 'bg-orange-50 border-orange-200',
  announcement: 'bg-yellow-50 border-yellow-200',
};

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiClient.get('/api/notifications');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const notifications: Notification[] = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await apiClient.patch(`/api/notifications/${notificationId}/read`);
      // Optionally refetch
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="px-6 py-3 bg-gray-50 sticky top-0">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{date}</p>
                  </div>

                  {/* Notifications */}
                  {dateNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 ${
                        notificationColors[notification.type] || 'bg-gray-50 border-gray-200'
                      } cursor-pointer hover:opacity-80 transition-opacity ${
                        !notification.read_at ? 'border-blue-400' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl flex-shrink-0">
                          {notificationIcons[notification.type] || '📢'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!notification.read_at && (
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors">
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}