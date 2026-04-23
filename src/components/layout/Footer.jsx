import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        width: "100%", // Ensure it spans the full width
        position: "fixed", // Fix the position
        bottom: 0, // Align to the bottom
        left: 0, // Align to the left
        right: 0, // Align to the right
        zIndex: 1100, // Ensure it's above other content, similar to AppBar's default zIndex
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap" // Added for mobile-friendliness
        sx={{ mb: 1 }}
      >
        <Link
          color="inherit"
          href="/emiCalculator/privacy-policy"
          underline="hover"
        >
          Privacy Policy
        </Link>
        <Link
          color="inherit"
          href="/emiCalculator/terms-of-service"
          underline="hover"
        >
          Terms of Service
        </Link>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {"Copyright © "}
        <Link color="inherit" href="https://yourwebsite.com/">
          SmartFund Manager
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
};

export default Footer;
