import React from 'react';
import {
  Box,
  Typography,
  Link,
  Stack,
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const footerLinks = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Contact Us', path: '/contact-us' },
];

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,

        // Dynamic styling:
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)', // Works for 'Glass' style
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
        color: theme.palette.text.secondary,
        transition: theme.transitions.create([
          'background-color',
          'border-color',
        ]),
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2" color="inherit" sx={{ fontWeight: 500 }}>
            © {new Date().getFullYear()}{' '}
            <Link
              href="/"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              sx={{ fontWeight: 700, textDecoration: 'none' }}
            >
              SmartFund Manager
            </Link>
          </Typography>

          <Stack direction="row" spacing={3}>
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                }}
                underline="none"
                sx={{
                  color: 'inherit',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              display: { xs: 'none', md: 'block' },
              borderLeft: `1px solid ${theme.palette.divider}`,
              pl: 4,
              color: 'text.disabled',
            }}
          >
            Built for precision. Managed with intelligence.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
