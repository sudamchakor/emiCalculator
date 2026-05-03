import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Fullscreen,
  FullscreenExit,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  DeleteSweep as DeleteSweepIcon,
  Article as ArticleIcon,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

// Firebase Imports
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

// Utils / Config
import { articleCategories } from '../../utils/articleCategories';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_UID } from '../../utils/constants';
import PageHeader from '../../components/common/PageHeader';

const WriteArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const quillRef = useRef(null);

  // --- Form State ---
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  // --- UI State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // --- WYSIWYG Modules Configuration ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  // --- Helpers: Word Count & Stats ---
  const getStats = useCallback(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const readTime = Math.ceil(words / 200);
    return { words, readTime };
  }, [content]);

  const stats = getStats();

  // --- Effect: Authorization Logic ---
  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate('/admin/login');
      else if (user.uid !== ADMIN_UID) {
        setSnackbar({
          open: true,
          message: 'Unauthorized access.',
          severity: 'error',
        });
        navigate('/admin/articles');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, authLoading, navigate]);

  // --- Effect: Load Article (Edit Mode) or Local Draft (New Mode) ---
  useEffect(() => {
    const loadData = async () => {
      if (id && isAuthorized) {
        try {
          const docSnap = await getDoc(doc(db, 'articles', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setCategory(data.category || '');
            setImageUrl(data.imageUrl || '');
            setContent(data.content || '');
          }
        } catch (err) {
          setSnackbar({
            open: true,
            message: 'Failed to load article.',
            severity: 'error',
          });
        }
      } else if (!id && isAuthorized) {
        const savedDraft = localStorage.getItem('sf_article_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setCategory(parsed.category || '');
          setImageUrl(parsed.imageUrl || '');
          setContent(parsed.content || '');
        }
      }
    };
    loadData();
  }, [id, isAuthorized]);

  // --- Effect: Auto-save Draft ---
  useEffect(() => {
    if (!id && isAuthorized && (title || content)) {
      const draft = {
        title,
        category,
        imageUrl,
        content,
        timestamp: Date.now(),
      };
      localStorage.setItem('sf_article_draft', JSON.stringify(draft));
    }
  }, [title, category, imageUrl, content, id, isAuthorized]);

  // --- Effect: Block navigation if unsaved ---
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if ((title || content) && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content, isSubmitting]);

  // --- Handlers ---
  const handlePublish = async (e, status = 'published') => {
    if (e) e.preventDefault();
    if (!title || !content || !category) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields.',
        severity: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const articleData = {
        title,
        category,
        imageUrl,
        content,
        status,
        updatedAt: serverTimestamp(),
        authorUid: user.uid,
        authorName: user.displayName || user.email,
      };

      if (id) {
        await updateDoc(doc(db, 'articles', id), articleData);
      } else {
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          createdAt: serverTimestamp(),
        });
        localStorage.removeItem('sf_article_draft');
      }
      navigate('/admin/articles');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Database Error.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (!isAuthorized) return null;

  return (
    <Fade in timeout={800}>
      <Box
        sx={
          isFullScreen
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1300,
                bgcolor: 'background.paper',
                overflowY: 'auto',
                p: { xs: 1, md: 4 },
              }
            : {}
        }
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isFullScreen && (
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBack />
                  </IconButton>
                )}
                <Typography variant="h4" fontWeight="bold">
                  {id ? 'Edit Article' : 'Create Article'}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: isFullScreen ? 0 : 6 }}
              >
                {stats.words} words | {stats.readTime} min read
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, val) => val && setViewMode(val)}
                size="small"
                color="primary"
              >
                <ToggleButton value="edit">
                  <Edit sx={{ mr: 1, fontSize: 18 }} /> Edit
                </ToggleButton>
                <ToggleButton value="preview">
                  <Visibility sx={{ mr: 1, fontSize: 18 }} /> Preview
                </ToggleButton>
              </ToggleButtonGroup>
              <Tooltip
                title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
              >
                <IconButton
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  color="inherit"
                >
                  {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Paper
            elevation={isFullScreen ? 0 : 3}
            sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}
          >
            {viewMode === 'edit' ? (
              <Stack spacing={3}>
                <Box
                  display="grid"
                  gridTemplateColumns={{ md: '2fr 1fr' }}
                  gap={2}
                >
                  <TextField
                    label="Article Title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Guide to Investment Diversification"
                  />
                  <TextField
                    select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {articleCategories.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <TextField
                  label="Featured Image URL"
                  fullWidth
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  helperText="Recommended: 1200x600px"
                />

                {imageUrl && (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 200,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #ddd',
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) =>
                        (e.target.src =
                          'https://placehold.co/1200x600?text=Invalid+Image+URL')
                      }
                    />
                  </Box>
                )}

                <Divider />

                <Box
                  sx={{
                    '.ql-toolbar': {
                      position: 'sticky',
                      top: isFullScreen ? 0 : -24, // Adjust based on your layout's navbar height
                      zIndex: 10,
                      bgcolor: 'background.paper',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    },
                    '.ql-container': {
                      minHeight: '450px',
                      fontSize: '1.1rem',
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                    },
                  }}
                >
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder="Write your article content here..."
                  />
                </Box>
              </Stack>
            ) : (
              /* --- WYSIWYG PREVIEW MODE --- */
              <Box
                className="ql-snow"
                sx={{ minHeight: '600px', p: { md: 4 } }}
              >
                <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                  <Typography
                    variant="overline"
                    color="primary"
                    fontWeight="bold"
                  >
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
            )}

            {/* Footer Actions */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => {
                  if (window.confirm('Clear all unsaved progress?')) {
                    setTitle('');
                    setContent('');
                    setImageUrl('');
                    setCategory('');
                    localStorage.removeItem('sf_article_draft');
                  }
                }}
              >
                Clear
              </Button>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                  onClick={() => handlePublish(null, 'draft')}
                >
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloudUploadIcon />
                    )
                  }
                  disabled={isSubmitting}
                  onClick={(e) => handlePublish(e, 'published')}
                  sx={{ px: 4 }}
                >
                  {id ? 'Update' : 'Publish'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default WriteArticle;
