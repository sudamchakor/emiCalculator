import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ArticleHeader = ({ article }) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '60vh',
        position: 'relative',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${article.imageUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        pt: { xs: 12, md: 0 },
      }}
    >
      <Container maxWidth="md" sx={{ pb: { xs: 8, md: 12 } }}>
        <Stack spacing={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/articles"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 1,
              textTransform: 'none',
              width: 'fit-content',
            }}
          >
            Back to Articles
          </Button>
          <Chip
            label={article.category}
            sx={{
              bgcolor: '#FF9800',
              color: '#fff',
              fontWeight: 800,
              width: 'fit-content',
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: '#fff',
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
            }}
          >
            {article.title}
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            sx={{ color: 'rgba(255,255,255,0.9)' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="subtitle2">
                {article.readTime || '5'} min read
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthIcon fontSize="small" />
              <Typography variant="subtitle2">
                {article.createdAt?.toDate
                  ? article.createdAt.toDate().toLocaleDateString()
                  : 'Recent'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ArticleHeader;
