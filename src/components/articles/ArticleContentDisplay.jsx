import React from 'react';
import { Box } from '@mui/material';

const ArticleContentDisplay = ({ content }) => {
  return (
    <Box
      sx={{
        '& p': {
          fontSize: '1.15rem',
          lineHeight: 1.8,
          mb: 3,
          color: '#2d3436',
        },
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Box>
  );
};

export default ArticleContentDisplay;
