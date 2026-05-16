import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

const FILTER_OPTIONS = ['All', 'Placement', 'Result', 'Event'];

export default function FilterBar({ selectedType, onTypeChange }) {
  return (
    <Stack spacing={1.5} sx={{ mb: 3 }}>
      <Typography variant="h6" component="h2">
        Filter Notifications
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="notification-filter-label">Notification Type</InputLabel>
        <Select
          labelId="notification-filter-label"
          id="notification-filter"
          value={selectedType}
          label="Notification Type"
          onChange={(event) => onTypeChange(event.target.value)}
        >
          {FILTER_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
