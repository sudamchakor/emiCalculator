import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Container,
  InputAdornment,
  Button,
  useTheme,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

import ArticleCard from '../../components/articles/ArticleCard';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import SuspenseFallback from '../../components/common/SuspenseFallback';

const ArticlesArchive = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  // Data States
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Pagination States
  const [page, setPage] = useState(1);
  const articlesPerPage = 6; // Set how many articles per page

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'articles'),
          orderBy('createdAt', 'desc'),
        );
        const querySnapshot = await getDocs(q);

        const fetchedArticles = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((a) => a && a.title);

        setAllArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Filter Logic + Page Reset
  useEffect(() => {
    const result = allArticles.filter((a) => {
      const matchesSearch =
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === 'All' || a.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    setFilteredArticles(result);
    setPage(1); // Reset to first page whenever filters change
  }, [searchTerm, selectedCategory, allArticles]);

  // Pagination Logic
  const indexOfLastArticle = page * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    'All',
    ...new Set(allArticles.map((a) => a.category).filter(Boolean)),
  ];

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        pb: 10,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <PageHeader
          title="Knowledge Hub"
          subtitle="Empowering your financial journey with expert insights."
          icon={ArticleIcon}
        />

        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 6, alignItems: 'center' }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: '#fff' },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              InputProps={{ sx: { borderRadius: 3, bgcolor: '#fff' } }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {isAuthenticated && (
            <Grid item xs={12} sm={6} md={3}>
              <Button
                component={Link}
                to="/admin/write-article"
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  boxShadow: theme.shadows[4],
                }}
              >
                Create Article
              </Button>
            </Grid>
          )}
        </Grid>

        {loading ? (
          <SuspenseFallback message="" />
        ) : (
          <>
            <Grid container spacing={4}>
              {currentArticles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <ArticleCard article={article} />
                </Grid>
              ))}

              {!loading && filteredArticles.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 12, opacity: 0.6 }}>
                    <Typography variant="h5">
                      No matching insights found.
                    </Typography>
                    <Typography>
                      Try adjusting your filters or search terms.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Pagination Component */}
            {totalPages > 1 && (
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
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ArticlesArchive;
