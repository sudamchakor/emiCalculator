import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import ArticleCard from './ArticleCard';

const ArticleGridDisplay = ({ articles, loading, filteredArticlesCount }) => {
  if (loading) {
    return null; // Or a loading spinner if preferred, but SuspenseFallback is used higher up
  }

  if (filteredArticlesCount === 0) {
    return (
      <Grid item xs={12}>
        <Box sx={{ textAlign: 'center', py: 12, opacity: 0.6 }}>
          <Typography variant="h5">No matching insights found.</Typography>
          <Typography>Try adjusting your filters or search terms.</Typography>
        </Box>
      </Grid>
    );
  }

  return (
    <Grid container spacing={4}>
      {articles.map((article) => (
        <Grid item xs={12} sm={6} md={4} key={article.id}>
          <ArticleCard article={article} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ArticleGridDisplay;
