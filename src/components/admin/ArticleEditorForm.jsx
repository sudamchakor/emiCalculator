import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';
import { articleCategories } from '../../utils/articleCategories';

const ArticleEditorForm = ({
  title,
  setTitle,
  category,
  setCategory,
  imageUrl,
  setImageUrl,
  content,
  setContent,
  quillRef,
  modules,
  isFullScreen,
}) => {
  return (
    <Stack spacing={3}>
      <Box display="grid" gridTemplateColumns={{ md: '2fr 1fr' }} gap={2}>
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
          // Fix for duplicate "Normal" labels on the toolbar (Size and Header)
          '.ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before':
            {
              content: '"Size"',
            },
          '.ql-snow .ql-picker.ql-size .ql-picker-item:not([data-value])::before':
            {
              content: '"Normal Size"',
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
  );
};

export default ArticleEditorForm;
