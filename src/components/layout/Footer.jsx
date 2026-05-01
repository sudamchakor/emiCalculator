import React from "react";
import {
  Box,
  Typography,
  Link,
  Stack,
  Container,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        // --- STICKY LOGIC ---
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar, // Ensures it stays above page content
        // --------------------

        // Glassmorphism effect
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        borderTop: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            © {new Date().getFullYear()}{" "}
            <Link
              color="primary"
              href="/"
              sx={{ fontWeight: 700, textDecoration: "none" }}
            >
              SmartFund Manager
            </Link>
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link
              href="/privacy-policy"
              underline="none"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.75rem",
                "&:hover": { color: "primary.main" },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              underline="none"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.75rem",
                "&:hover": { color: "primary.main" },
              }}
            >
              Terms of Service
            </Link>
          </Stack>

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              fontWeight: 600,
              display: { xs: "none", md: "block" },
              borderLeft: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              pl: 4,
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
