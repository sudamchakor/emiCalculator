import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Container,
  Paper,
  Snackbar,
  Alert,
  Stack,
  Divider,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ArticleIcon from '@mui/icons-material/Article';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';

// Firebase Imports
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

// Centralized category imports
import { articleCategories } from '../../utils/articleCategories';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_UID } from '../../utils/constants';

const WriteArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (user.uid !== ADMIN_UID) {
        setSnackbar({
          open: true,
          message: 'You are not authorized to write or edit articles.',
          severity: 'error',
        });
        navigate('/admin/articles');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (id && isAuthorized) {
        try {
          const docRef = doc(db, 'articles', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setCategory(data.category || '');
            setImageUrl(data.imageUrl || '');
            setContent(data.content || '');
          } else {
            console.log('No such document!');
            setSnackbar({
              open: true,
              message: 'Article not found.',
              severity: 'error',
            });
            navigate('/admin/articles');
          }
        } catch (error) {
          console.error('Error fetching article for edit:', error);
          setSnackbar({
            open: true,
            message: 'Error loading article for editing.',
            severity: 'error',
          });
        }
      }
    };

    if (isAuthorized) {
      fetchArticle();
    }
  }, [id, navigate, isAuthorized]);

  const handlePublish = async (e, status = 'published') => {
    if (e) e.preventDefault();

    if (!user || user.uid !== ADMIN_UID) {
      setSnackbar({
        open: true,
        message: 'You are not authorized to perform this action.',
        severity: 'error',
      });
      return;
    }

    if (!title || !content || !category) {
      setSnackbar({
        open: true,
        message: 'Please fill in Title, Category, and Content.',
        severity: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const authorUid = user.uid;
      const authorName = user.displayName || user.email;

      const articleData = {
        title,
        category,
        imageUrl,
        content,
        status,
        updatedAt: serverTimestamp(),
        authorUid,
        authorName,
      };

      if (id) {
        const docRef = doc(db, 'articles', id);
        await updateDoc(docRef, articleData);
        setSnackbar({
          open: true,
          message:
            status === 'published'
              ? 'Article updated and published successfully!'
              : 'Draft updated!',
          severity: 'success',
        });
      } else {
        const articlesRef = collection(db, 'articles');
        await addDoc(articlesRef, {
          ...articleData,
          createdAt: serverTimestamp(),
        });
        setSnackbar({
          open: true,
          message:
            status === 'published'
              ? 'Article published successfully!'
              : 'Draft saved!',
          severity: 'success',
        });

        setTitle('');
        setCategory('');
        setImageUrl('');
        setContent('');
      }
      navigate('/admin/articles');
    } catch (error) {
      console.error('Firestore Error:', error);
      setSnackbar({
        open: true,
        message: 'Error connecting to database.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // If not authorized, render nothing for the main content area,
  // but still render the Snackbar.
  if (!isAuthorized) {
    return (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    );
  }

  // Only render Fade and its content if authorized
  return (
    <>
      <Fade in={true} timeout={1000}>
        {/* Wrap everything in a simple div to ensure a stable DOM element for Fade */}
        <div>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <PageHeader
              title={id ? 'Edit Article' : 'Create Article'}
              subtitle={
                id
                  ? 'Modify and update your existing article.'
                  : 'Draft and format high-quality financial content for the platform.'
              }
              icon={ArticleIcon}
            />

            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 4 },
                mt: 3,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <form onSubmit={(e) => handlePublish(e, 'published')}>
                <Stack spacing={3}>
                  <Box display="grid" gridTemplateColumns={{ md: '2fr 1fr' }} gap={2}>
                    <TextField
                      label="Article Title"
                      variant="outlined"
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g., Maximizing Tax Savings in 2026"
                    />
                    <TextField
                      select
                      label="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      {articleCategories.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <TextField
                    label="Featured Image URL"
                    variant="outlined"
                    fullWidth
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    helperText="Paste a URL for the header image"
                  />

                  <Divider sx={{ my: 2, borderColor: 'divider' }} />

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}
                    >
                      Article Content
                    </Typography>
                    <Box
                      sx={{
                        '.ql-container': {
                          minHeight: '350px',
                          fontSize: '16px',
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                          borderColor: 'divider',
                        },
                        '.ql-toolbar': {
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          background: (theme) => theme.palette.action.hover,
                          borderColor: 'divider',
                        },
                        '.ql-editor': {
                          minHeight: '350px',
                        },
                      }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        placeholder="Start writing..."
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate(-1)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      onClick={() => handlePublish(null, 'draft')}
                      disabled={isSubmitting}
                      color="secondary"
                    >
                      {id ? 'Save Changes' : 'Save Draft'}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <CloudUploadIcon />
                        )
                      }
                      disabled={isSubmitting}
                      sx={{ px: 4 }}
                    >
                      {isSubmitting
                        ? id
                          ? 'Updating...'
                          : 'Publishing...'
                        : id
                        ? 'Update Article'
                        : 'Publish Now'}{' '}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Paper>
          </Container>
        </div>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WriteArticle;
