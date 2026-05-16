import { logEvent } from './logger';

export const BASE_URL = 'http://4.224.186.213/evaluation-service';
export const TOKEN = import.meta.env.VITE_API_TOKEN || '';

function buildHeaders() {
  if (!TOKEN) {
    throw new Error('Missing VITE_API_TOKEN in frontend env configuration');
  }

  return {
    Authorization: `Bearer ${TOKEN}`,
  };
}

function buildNotificationsUrl(page = 1, limit = 10, type = 'All') {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));

  if (type && type !== 'All') {
    params.set('notification_type', type);
  }

  return `${BASE_URL}/notifications?${params.toString()}`;
}

export async function fetchNotifications(page = 1, limit = 10, type = 'All') {
  try {
    const response = await fetch(buildNotificationsUrl(page, limit, type), {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    await logEvent('info', 'api', 'Notifications fetched successfully');
    return data;
  } catch (error) {
    await logEvent('error', 'api', `Failed to fetch notifications: ${error.message}`);
    throw error;
  }
}

export async function markAsRead(id) {
  try {
    const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    await logEvent('info', 'api', `Marked notification ${id} as read`);
    return data;
  } catch (error) {
    await logEvent('error', 'api', `Failed to mark notification as read: ${error.message}`);
    throw error;
  }
}

export async function deleteNotification(id) {
  try {
    const response = await fetch(`${BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    await logEvent('info', 'api', `Deleted notification ${id}`);
    return data;
  } catch (error) {
    await logEvent('error', 'api', `Failed to delete notification: ${error.message}`);
    throw error;
  }
}
