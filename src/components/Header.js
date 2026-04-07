import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useEmiContext } from "../context/EmiContext";
import "./Header.css";
import { SettingsRounded } from "@mui/icons-material";

const Header = () => {
  const { calculatedValues, currency, setCurrency, themeMode, setThemeMode } =
    useEmiContext();

  const handleExport = (event) => {
    const value = event.target.value;
    if (value === "pdf") {
      window.print();
    } else if (value === "excel") {
      if (!calculatedValues || !calculatedValues.schedule) return;
      const tableData = calculatedValues.schedule.map((row) => ({
        Month: row.month,
        Date: row.date,
        Principal: row.principal.toFixed(2),
        Interest: row.interest.toFixed(2),
        Prepayment: row.prepayment.toFixed(2),
        Balance: row.balance.toFixed(2),
      }));

      const ws = XLSX.utils.json_to_sheet(tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Schedule");
      XLSX.writeFile(wb, "emi_schedule.xlsx");
    }
  };

  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar>
        <CalculateIcon className="header-icon" />
        <Typography variant="h6" component="div" className="header-title">
          <Link to="/" className="header-link">
            EMI Calculator
          </Link>
        </Typography>
        <Box className="header-actions">
          <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
            <Select
              value=""
              onChange={handleExport}
              displayEmpty
              className="header-select"
              disableUnderline
            >
              <MenuItem value="" disabled>
                Export
              </MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="button">
            <Link to="/faq" className="header-link">
              FAQ
            </Link>
          </Typography>

          <Typography variant="button">
            <Link to="/settings" className="header-link">
              <SettingsRounded className="header-icon" style={{ marginBottom: '-6px'}} />
            </Link>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
