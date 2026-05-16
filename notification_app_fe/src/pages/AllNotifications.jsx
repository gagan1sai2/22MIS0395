import { Alert, Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
import FilterBar from '../components/FilterBar';
import NotificationCard from '../components/NotificationCard';
import PaginationControls from '../components/PaginationControls';
import { useNotifications } from '../hooks/useNotifications';

export default function AllNotifications() {
  const {
    notifications,
    page,
    setPage,
    filterType,
    setFilterType,
    totalPages,
    loading,
    error,
    handleMarkAsRead,
    handleDeleteNotification,
  } = useNotifications(6);

  const handleTypeChange = (value) => {
    setPage(1);
    setFilterType(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse, filter, update, and delete notifications.
        </Typography>
      </Box>

      <FilterBar selectedType={filterType} onTypeChange={handleTypeChange} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {notifications.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">No notifications found for the selected filter.</Alert>
            </Grid>
          ) : (
            notifications.map((notification) => (
              <Grid key={notification.id} item xs={12} md={6} lg={4}>
                <NotificationCard
                  notification={notification}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      {!loading && !error && notifications.length > 0 && (
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </Container>
  );
}
