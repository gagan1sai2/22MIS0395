import { Alert, Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NotificationCard from '../components/NotificationCard';
import { deleteNotification, fetchNotifications, markAsRead } from '../services/api';

const PRIORITY_WEIGHTS = {
  Placement: 30,
  Result: 20,
  Event: 10,
};

function calculateRecencyScore(createdAt) {
  const createdTime = new Date(createdAt);
  const now = new Date();
  const hoursAgo = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60);

  return Math.max(0, 48 - hoursAgo);
}

function calculatePriorityScore(notification) {
  const typeWeight = PRIORITY_WEIGHTS[notification.type] ?? 0;
  return typeWeight + calculateRecencyScore(notification.created_at);
}

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPriorityInbox = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchNotifications(1, 100, 'All');
      const rankedNotifications = (Array.isArray(response?.data) ? response.data : [])
        .map((notification) => ({
          ...notification,
          score: calculatePriorityScore(notification),
        }))
        .sort((left, right) => right.score - left.score)
        .slice(0, 10);

      setNotifications(rankedNotifications);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load priority inbox');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriorityInbox();
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Priority Inbox
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Top 10 notifications ranked by type priority and recency.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {notifications.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">No ranked notifications available.</Alert>
            </Grid>
          ) : (
            notifications.map((notification) => (
              <Grid key={notification.id} item xs={12} md={6} lg={4}>
                <NotificationCard
                  notification={notification}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                  priorityScore={notification.score}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
}
