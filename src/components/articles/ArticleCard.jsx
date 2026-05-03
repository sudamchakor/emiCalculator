import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  CardActions,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Icons
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShieldIcon from '@mui/icons-material/Shield';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import FlagIcon from '@mui/icons-material/Flag';
import BalanceIcon from '@mui/icons-material/Balance';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentsIcon from '@mui/icons-material/Payments';

const getCategoryPalette = (category, theme) => {
  const cat = category?.toUpperCase() || 'DEFAULT';

  const palettes = {
    'TAX STRATEGY': {
      icon: <ReceiptLongIcon fontSize="large" />,
      color: theme.palette.info.main,
      bg: theme.palette.info.light + '20',
    },
    TAX: {
      icon: <ReceiptLongIcon fontSize="large" />,
      color: theme.palette.info.dark,
      bg: theme.palette.info.light + '20',
    },
    'INVESTMENT & TAX': {
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      color: theme.palette.success.main,
      bg: theme.palette.success.light + '20',
    },
    INVESTMENTS: {
      icon: <TrendingUpIcon fontSize="large" />,
      color: theme.palette.success.dark,
      bg: theme.palette.success.light + '20',
    },
    'FINANCIAL SECURITY': {
      icon: <ShieldIcon fontSize="large" />,
      color: theme.palette.error.main,
      bg: theme.palette.error.light + '20',
    },
    'GOAL PLANNING': {
      icon: <FlagIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      bg: theme.palette.secondary.light + '20',
    },
    SAVINGS: {
      icon: <SavingsIcon fontSize="large" />,
      color: '#c2185b',
      bg: '#fce4ec',
    },
    'FINANCIAL PLANNING': {
      icon: <BalanceIcon fontSize="large" />,
      color: theme.palette.primary.dark,
      bg: theme.palette.primary.light + '20',
    },
    FINANCE: {
      icon: <PaymentsIcon fontSize="large" />,
      color: theme.palette.warning.dark,
      bg: theme.palette.warning.light + '20',
    },
  };

  return (
    palettes[cat] || {
      icon: <ArticleIcon fontSize="large" />,
      color: theme.palette.text.secondary,
      bg: theme.palette.action.hover,
    }
  );
};

const ArticleCard = ({ article }) => {
  const theme = useTheme(); // Access the global theme

  if (!article) return null;

  const palette = getCategoryPalette(article.category, theme);

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      {/* Media / Icon Section */}
      {article.imageUrl ? (
        <CardMedia
          component="img"
          height="180"
          image={article.imageUrl}
          alt={article.title}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        />
      ) : (
        <Box
          sx={{
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: palette.bg,
            color: palette.color,
          }}
        >
          {palette.icon}
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: palette.color, fontWeight: 800, letterSpacing: 1.2 }}
        >
          {article.category || 'Resources'}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mt: 0.5,
            mb: 1.5,
            lineHeight: 1.3,
            color: theme.palette.text.primary,
          }}
        >
          {article.title || 'Insightful Reading'}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxDirection: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.excerpt ||
            'Explore this detailed guide on optimizing your financial strategy.'}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/articles/${article.id}`}
          fullWidth
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: theme.palette.primary.main, color: '#fff' },
          }}
        >
          Read Full Article
        </Button>
      </CardActions>
    </Card>
  );
};

export default ArticleCard;
