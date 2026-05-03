import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Fade, // Import Fade component
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// Firestore Imports
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_UID } from '../../utils/constants';
import SuspenseFallback from '../../components/common/SuspenseFallback';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isAdmin = user && user.uid === ADMIN_UID;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const querySnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles.');
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        setArticles(articles.filter((article) => article.id !== id));
        alert('Article deleted successfully!');
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('Failed to delete article.');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (loadingArticles) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <SuspenseFallback message="" />
      </Container>
    );
  }

  return (
    <Fade in={!loadingArticles} timeout={1000}>
      <Box> {/* Wrap Container with a Box to ensure a stable direct child for Fade */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1">
              Manage Articles
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/admin/articles/new"
              >
                Add New Article
              </Button>
            )}
          </Box>

          {articles.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
              No articles found.
            </Typography>
          ) : (
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="articles table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Title</TableCell>
                      <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Author</TableCell>
                      <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Created At</TableCell>
                      <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Updated At</TableCell>
                      {isAdmin && <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {articles
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((article) => (
                        <TableRow
                          key={article.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': {
                              backgroundColor: 'action.hover',
                              cursor: 'pointer',
                            },
                            transition: 'background-color 0.3s ease',
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {article.title}
                          </TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>{article.authorName || 'N/A'}</TableCell>
                          <TableCell>{formatDate(article.createdAt)}</TableCell>
                          <TableCell>{formatDate(article.updatedAt)}</TableCell>
                          {isAdmin && (
                            <TableCell align="right">
                              <IconButton
                                aria-label="edit"
                                component={Link}
                                to={`/admin/articles/edit/${article.id}`}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => handleDelete(article.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={articles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default AdminArticles;
