import React from 'react';
import { Box, CardMedia, Typography, useTheme } from '@mui/material';

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

const CategoryIconDisplay = ({ article }) => {
  const theme = useTheme();
  const palette = getCategoryPalette(article.category, theme);

  return article.imageUrl ? (
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
  );
};

export default CategoryIconDisplay;
