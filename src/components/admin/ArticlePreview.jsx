import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const ArticlePreview = ({ title, category, imageUrl, content }) => {
  return (
    <Box className="ql-snow" sx={{ minHeight: '600px', p: { md: 4 } }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="overline" color="primary" fontWeight="bold">
          {category || 'Category'}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          {title || 'Untitled Article'}
        </Typography>
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            sx={{ width: '100%', borderRadius: 2, mb: 4 }}
          />
        )}
        <Divider sx={{ mb: 4 }} />
        <Box
          className="ql-editor" // This class applies Quill's styles to the HTML
          dangerouslySetInnerHTML={{
            __html: content || '<p>No content to preview.</p>',
          }}
          sx={{ p: '0 !important' }}
        />
      </Box>
    </Box>
  );
};

export default ArticlePreview;
