import React from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';
import { motion } from 'framer-motion';

// The Zoom + Glow animation
const popAndGlow = keyframes`
  0%, 100% { transform: scale(0.9); opacity: 0.4; filter: blur(1px); }
  50% { transform: scale(1.15); opacity: 1; filter: blur(0px); }
`;

const SuspenseFallback = ({ message = "Calculating wealth projections..." }) => {
    const theme = useTheme();

    const keys = [
        { symbol: '+', color: theme.palette.primary.main },   // Logic
        { symbol: '−', color: theme.palette.error.main },     // Expenses
        { symbol: '×', color: theme.palette.success.main },   // Growth
        { symbol: '%', color: theme.palette.warning.main },   // Tax/Interest
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    width: '100%',
                    gap: 4
                }}
            >
                {/* 2x2 Calculator Key Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                    }}
                >
                    {keys.map((key, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: key.color,
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '1.4rem',
                                fontWeight: 'bold',
                                boxShadow: `0 8px 20px ${key.color}50`,
                                animation: `${popAndGlow} 1.5s infinite ease-in-out`,
                                animationDelay: `${i * 0.2}s`,
                            }}
                        >
                            {key.symbol}
                        </Box>
                    ))}
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            fontSize: '1rem',
                            letterSpacing: '1px',
                            mb: 1
                        }}
                    >
                        SMART ENGINE ACTIVE
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontFamily: 'monospace'
                        }}
                    >
                        {message}
                    </Typography>
                </Box>
            </Box>
        </motion.div>
    );
};

export default SuspenseFallback;