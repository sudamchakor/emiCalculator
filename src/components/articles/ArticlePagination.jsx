import React from 'react';
import { Box, Pagination } from '@mui/material';

const ArticlePagination = ({ totalPages, page, handlePageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 'bold',
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};

export default ArticlePagination;
