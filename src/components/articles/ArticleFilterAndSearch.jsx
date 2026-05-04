import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ArticleFilterAndSearch = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  return (
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
  );
};

export default ArticleFilterAndSearch;
