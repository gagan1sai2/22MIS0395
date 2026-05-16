import { useCallback, useEffect, useState } from 'react';
import { deleteNotification, fetchNotifications, markAsRead } from '../services/api';

export function useNotifications(initialLimit = 6) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [filterType, setFilterType] = useState('All');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchNotifications(page, limit, filterType);
      const items = Array.isArray(response?.data) ? response.data : [];
      const total = typeof response?.total === 'number' ? response.total : items.length;

      setNotifications(items);
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load notifications');
      setNotifications([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filterType, limit, page]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification,
        ),
      );
    } catch (markError) {
      setError(markError.message || 'Failed to mark notification as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((currentNotifications) =>
        currentNotifications.filter((notification) => notification.id !== id),
      );
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete notification');
    }
  };

  return {
    notifications,
    page,
    setPage,
    filterType,
    setFilterType,
    totalPages,
    loading,
    error,
    refresh: loadNotifications,
    handleMarkAsRead,
    handleDeleteNotification,
  };
}
