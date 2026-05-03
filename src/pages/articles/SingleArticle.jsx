import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';

// Firestore
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

import { useAuth } from '../../hooks/useAuth';
import SuspenseFallback from '../../components/common/SuspenseFallback';

// Reusing the category palette logic for consistency
const getCategoryPalette = (category, theme) => {
  const cat = category?.toUpperCase() || 'DEFAULT';
  const palettes = {
    'TAX STRATEGY': {
      color: theme.palette.info.main,
      bg: theme.palette.info.light + '20',
    },
    INVESTMENTS: {
      color: theme.palette.success.main,
      bg: theme.palette.success.light + '20',
    },
    'FINANCIAL SECURITY': {
      color: theme.palette.error.main,
      bg: theme.palette.error.light + '20',
    },
    'GOAL PLANNING': {
      color: theme.palette.secondary.main,
      bg: theme.palette.secondary.light + '20',
    },
  };
  return (
    palettes[cat] || {
      color: theme.palette.text.secondary,
      bg: theme.palette.action.hover,
    }
  );
};

const SingleArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articles', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such document!');
          navigate('/articles');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        navigate('/articles');
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  if (loading) return <SuspenseFallback />;
  if (!article) return null;

  const palette = getCategoryPalette(article.category, theme);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Navigation & Actions Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/articles"
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Back to Articles
        </Button>

        {isAuthenticated && (
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<EditIcon />}
              component={Link}
              to={`/admin/edit-article/${id}`}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDelete}
              sx={{ borderRadius: 2 }}
            >
              Delete
            </Button>
          </Stack>
        )}
      </Box>

      {/* Article Header */}
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}
      >
        {article.title}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Chip
          label={article.category}
          sx={{ bgcolor: palette.bg, color: palette.color, fontWeight: 700 }}
        />
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ color: 'text.secondary' }}
        >
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2">
            {article.readTime || '5'} min read
          </Typography>
        </Stack>
      </Stack>

      {/* Meta Dates */}
      <Box sx={{ mb: 4, color: 'text.disabled' }}>
        <Typography variant="caption" display="block">
          Created: {article.createdAt?.toDate().toLocaleDateString()}
          {article.updatedAt &&
            ` • Updated: ${article.updatedAt.toDate().toLocaleDateString()}`}
        </Typography>
      </Box>

      {/* Main Image or Themed Icon */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 250, md: 450 },
          borderRadius: 4,
          overflow: 'hidden',
          mb: 6,
          bgcolor: palette.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {article.imageUrl ? (
          <Box
            component="img"
            src={article.imageUrl}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ArticleIcon
            sx={{ fontSize: 120, color: palette.color, opacity: 0.5 }}
          />
        )}
      </Box>

      {/* Article Content */}
      <Box
        sx={{
          typography: 'body1',
          lineHeight: 1.8,
          color: theme.palette.text.primary,
          '& p': { mb: 3 },
          '& h2': { mt: 6, mb: 2, fontWeight: 700 },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: 3,
            py: 1,
            my: 4,
            fontStyle: 'italic',
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        {/* If using Markdown, you'd use a component like react-markdown here */}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </Box>

      <Divider sx={{ my: 8 }} />

      {/* Bottom Navigation */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/articles"
          sx={{ color: theme.palette.text.secondary }}
        >
          Back to Articles
        </Button>
      </Box>
    </Container>
  );
};

export default SingleArticle;
