import { Box, Pagination } from '@mui/material';

export default function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        color="primary"
        onChange={(_, value) => onPageChange(value)}
      />
    </Box>
  );
}
