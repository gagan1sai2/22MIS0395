import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

function getTypeColor(type) {
  switch (type) {
    case 'Placement':
      return 'success';
    case 'Result':
      return 'primary';
    case 'Event':
      return 'secondary';
    default:
      return 'default';
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return 'Unknown time';
  }

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? String(timestamp) : date.toLocaleString();
}

export default function NotificationCard({ notification, onMarkRead, onDelete, priorityScore }) {
  const isUnread = !notification.is_read;
  const displayPriorityScore =
    typeof priorityScore === 'number' ? priorityScore.toFixed(2) : null;

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isUnread ? 'primary.main' : 'divider',
        backgroundColor: isUnread ? 'rgba(25, 118, 210, 0.06)' : 'background.paper',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={notification.type || 'Notification'} color={getTypeColor(notification.type)} size="small" />
            {displayPriorityScore && (
              <Chip label={`Priority Score: ${displayPriorityScore}`} color="warning" size="small" />
            )}
          </Stack>

          <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
            {notification.message}
          </Typography>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Created at
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatTimestamp(notification.created_at)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {isUnread ? (
            <Button variant="contained" size="small" onClick={() => onMarkRead(notification.id)}>
              Mark as Read
            </Button>
          ) : (
            <Chip label="Read" color="success" size="small" variant="outlined" />
          )}
        </Stack>

        <IconButton color="error" aria-label="delete notification" onClick={() => onDelete(notification.id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
