import React, { useMemo, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Context
import { EmiProvider, useEmiContext } from "./context/EmiContext";

// Components
import Header from "./components/Header";
import Calculator from "./pages/Calculator";
import FAQ from "./pages/FAQ";
import Settings from "./components/Settings";

// Styles
import "./App.css";

import {
  blue,
  lightBlue,
  green,
  lightGreen,
  yellow,
  amber,
} from "@mui/material/colors";

const AppContent = () => {
  const { themeMode } = useEmiContext();

  useEffect(() => {
    document.body.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  const theme = useMemo(() => {
    let palette = {
      primary: { main: "#1e90ff" },
      background: { default: "#f5f5f5" },
      mode: "light",
    };

    if (themeMode === "dark") {
      palette = {
        primary: { main: "#90caf9" },
        background: { default: "#121212", paper: "#1e1e1e" },
        mode: "dark",
      };
      document.documentElement.style.setProperty("--primary-color", "#333");
    } else if (themeMode === "blue") {
      palette = {
        primary: blue,
        secondary: lightBlue,
        background: { default: "#e3f2fd", paper: "#ffffff" },
        mode: "light",
      };
      document.documentElement.style.setProperty("--primary-color", blue[700]);
    } else if (themeMode === "green") {
      palette = {
        primary: green,
        secondary: lightGreen,
        background: { default: "#e8f5e9", paper: "#ffffff" },
        mode: "light",
      };
      document.documentElement.style.setProperty("--primary-color", green[700]);
    } else if (themeMode === "yellow") {
      palette = {
        primary: amber,
        secondary: yellow,
        background: { default: "#fffde7", paper: "#ffffff" },
        mode: "light",
      };
      document.documentElement.style.setProperty("--primary-color", amber[700]);
    } else {
      document.documentElement.style.setProperty(
        "--primary-color",
        "dodgerblue",
      );
    }

    return createTheme({ palette });
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Header />
        <Box component="main" className="main-content">
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <EmiProvider>
        <AppContent />
      </EmiProvider>
    </LocalizationProvider>
  );
}

export default App;